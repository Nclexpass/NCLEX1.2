/* 34_anatomy.js — Interactive 3D Clinical Anatomy (Procedural Three.js) */
/* Optimized for No-Asset-Dependency (Generates 3D models via code) */

(function () {
    'use strict';

    // --- CONFIGURACIÓN & RECURSOS ---
    const CONFIG = {
        threeCDN: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
        orbitCDN: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js' // Opcional, usaremos rotación auto si falla
    };

    let scene, camera, renderer, raycaster, mouse;
    let anatomyGroup;
    let isAnimating = false;
    let activeHotspots = [];

    // --- DATOS CLÍNICOS (NCLEX HOTSPOTS) ---
    const SYSTEMS = {
        cardio: {
            id: 'cardio',
            title: { es: 'Cardiovascular', en: 'Cardiovascular' },
            color: 0xff3333,
            points: [
                { x: 0, y: 3, z: 1.5, label: { es: 'Punto de Erb', en: "Erb's Point" }, info: { es: '3er espacio intercostal, borde esternal izquierdo. Auscultación S1/S2.', en: '3rd ICS, left sternal border. S1/S2 auscultation.' } },
                { x: 1, y: 3.5, z: 1.2, label: { es: 'Área Aórtica', en: 'Aortic Area' }, info: { es: '2do espacio intercostal, borde esternal derecho.', en: '2nd ICS, right sternal border.' } },
                { x: -0.5, y: 1.5, z: 1.5, label: { es: 'Pulso Apical', en: 'Apical Pulse' }, info: { es: '5to espacio intercostal, línea medioclavicular (Mitral).', en: '5th ICS, midclavicular line (Mitral area).' } }
            ]
        },
        resp: {
            id: 'resp',
            title: { es: 'Respiratorio', en: 'Respiratory' },
            color: 0x33cc33,
            points: [
                { x: 0, y: 4, z: 1, label: { es: 'Bronquial', en: 'Bronchial' }, info: { es: 'Sonido fuerte y agudo sobre la tráquea.', en: 'Loud, high-pitched over trachea.' } },
                { x: 2, y: 2, z: 0.8, label: { es: 'Vesicular', en: 'Vesicular' }, info: { es: 'Sonido suave, bases pulmonares.', en: 'Soft, breezy over lung bases.' } }
            ]
        },
        neuro: {
            id: 'neuro',
            title: { es: 'Neurológico', en: 'Neurological' },
            color: 0x9933cc,
            points: [
                { x: 0, y: 7.5, z: 0.5, label: { es: 'Lóbulo Frontal', en: 'Frontal Lobe' }, info: { es: 'Personalidad, comportamiento, emociones, función motora.', en: 'Personality, behavior, emotions, motor function.' } },
                { x: 0, y: 6.5, z: -1, label: { es: 'Cerebelo', en: 'Cerebellum' }, info: { es: 'Coordinación, equilibrio, motricidad fina.', en: 'Coordination, balance, fine motor skills.' } }
            ]
        },
        abd: {
            id: 'abd',
            title: { es: 'Abdominal', en: 'Abdominal' },
            color: 0xff9900,
            points: [
                { x: 1.5, y: -0.5, z: 1.2, label: { es: 'CSI (LUQ)', en: 'LUQ' }, info: { es: 'Estómago, Bazo, Páncreas.', en: 'Stomach, Spleen, Pancreas.' } },
                { x: -1.5, y: -0.5, z: 1.2, label: { es: 'CSD (RUQ)', en: 'RUQ' }, info: { es: 'Hígado, Vesícula biliar.', en: 'Liver, Gallbladder.' } },
                { x: -1.5, y: -2.5, z: 1.2, label: { es: 'CID (RLQ)', en: 'RLQ' }, info: { es: 'Apéndice (Punto de McBurney).', en: 'Appendix (McBurney Point).' } }
            ]
        }
    };

    // --- LOGICA 3D (THREE.JS WRAPPER) ---
    const Anatomy3D = {
        init: () => {
            if (window.THREE) {
                Anatomy3D.buildScene();
            } else {
                Anatomy3D.loadDependencies();
            }
        },

        loadDependencies: () => {
            const script = document.createElement('script');
            script.src = CONFIG.threeCDN;
            script.onload = () => Anatomy3D.buildScene();
            script.onerror = () => {
                document.getElementById('anatomy-canvas').innerHTML = `
                    <div class="flex items-center justify-center h-full text-red-500">
                        Error loading 3D Engine. Check connection.
                    </div>`;
            };
            document.head.appendChild(script);
        },

        buildScene: () => {
            const container = document.getElementById('anatomy-canvas');
            if (!container) return;

            // 1. Setup Básico
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf5f5f7); // Brand BG logic
            if (document.documentElement.classList.contains('dark')) scene.background = new THREE.Color(0x1c1c1e);

            camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 12;
            camera.position.y = 2;

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.innerHTML = ''; // Limpiar loader
            container.appendChild(renderer.domElement);

            // 2. Luces
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
            dirLight.position.set(5, 10, 7);
            scene.add(dirLight);

            // 3. Modelo Humano Procedural (Schematic Man)
            anatomyGroup = new THREE.Group();
            const material = new THREE.MeshPhongMaterial({ 
                color: 0x007AFF, 
                wireframe: true,
                transparent: true,
                opacity: 0.15
            });

            // Cabeza
            const head = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), material);
            head.position.y = 7;
            anatomyGroup.add(head);

            // Torso
            const torso = new THREE.Mesh(new THREE.CylinderGeometry(2, 1.5, 6, 32), material);
            torso.position.y = 2.5;
            anatomyGroup.add(torso);

            // Brazos
            const lArm = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 7), material);
            lArm.position.set(2.8, 3, 0);
            lArm.rotation.z = -0.2;
            anatomyGroup.add(lArm);

            const rArm = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 7), material);
            rArm.position.set(-2.8, 3, 0);
            rArm.rotation.z = 0.2;
            anatomyGroup.add(rArm);

            // Piernas
            const lLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.4, 8), material);
            lLeg.position.set(1, -5, 0);
            anatomyGroup.add(lLeg);

            const rLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.4, 8), material);
            rLeg.position.set(-1, -5, 0);
            anatomyGroup.add(rLeg);

            scene.add(anatomyGroup);

            // 4. Interacción
            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();
            
            renderer.domElement.addEventListener('mousemove', Anatomy3D.onMouseMove);
            renderer.domElement.addEventListener('click', Anatomy3D.onClick);
            window.addEventListener('resize', Anatomy3D.onResize);

            // Iniciar Loop
            isAnimating = true;
            Anatomy3D.animate();

            // Cargar sistema por defecto
            Anatomy3D.loadSystem('cardio');
        },

        loadSystem: (sysId) => {
            const sys = SYSTEMS[sysId];
            if (!sys || !anatomyGroup) return;

            // Limpiar puntos anteriores
            activeHotspots.forEach(p => anatomyGroup.remove(p));
            activeHotspots = [];

            // Crear nuevos puntos
            const sphereGeo = new THREE.SphereGeometry(0.3, 16, 16);
            const mat = new THREE.MeshLambertMaterial({ color: sys.color, emissive: 0x222222 });

            sys.points.forEach(pData => {
                const mesh = new THREE.Mesh(sphereGeo, mat);
                mesh.position.set(pData.x, pData.y, pData.z);
                mesh.userData = { ...pData }; // Guardar info
                
                // Animación de pulso simple (offset aleatorio)
                mesh.userData.pulsePhase = Math.random() * Math.PI;
                
                anatomyGroup.add(mesh);
                activeHotspots.push(mesh);
            });

            // Actualizar UI Texto
            const infoPanel = document.getElementById('anatomy-info');
            if (infoPanel) {
                infoPanel.innerHTML = `
                    <div class="animate-fade-in">
                        <h3 class="font-bold text-lg" style="color: #${sys.color.toString(16)}">
                            <span class="lang-es">${sys.title.es}</span>
                            <span class="lang-en hidden-lang">${sys.title.en}</span>
                        </h3>
                        <p class="text-sm text-gray-500 mb-2">
                            <span class="lang-es">Seleccione un punto para ver detalles clínicos.</span>
                            <span class="lang-en hidden-lang">Select a node to view clinical details.</span>
                        </p>
                    </div>
                `;
                if(window.NCLEX) window.NCLEX.toggleLanguage(); window.NCLEX.toggleLanguage(); // Refrescar lang
            }
        },

        animate: () => {
            if (!isAnimating) return;
            requestAnimationFrame(Anatomy3D.animate);

            // Rotación suave del modelo
            if (anatomyGroup) anatomyGroup.rotation.y += 0.002;

            // Pulsación de hotspots
            const time = Date.now() * 0.003;
            activeHotspots.forEach(mesh => {
                const scale = 1 + Math.sin(time + mesh.userData.pulsePhase) * 0.1;
                mesh.scale.set(scale, scale, scale);
            });

            if (renderer && scene && camera) renderer.render(scene, camera);
        },

        onResize: () => {
            const container = document.getElementById('anatomy-canvas');
            if (!container || !camera || !renderer) return;
            
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        },

        onMouseMove: (event) => {
            // Actualizar mouse para raycaster
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Highlight hover
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(activeHotspots);
            
            document.body.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
        },

        onClick: (event) => {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(activeHotspots);
            
            if (intersects.length > 0) {
                const data = intersects[0].object.userData;
                Anatomy3D.showInfo(data);
            }
        }
    };

    // --- FUNCIONES UI ---
    Anatomy3D.showInfo = (data) => {
        const infoPanel = document.getElementById('anatomy-info');
        if (!infoPanel) return;

        infoPanel.innerHTML = `
            <div class="animate-slide-up bg-white dark:bg-[#2c2c2e] p-4 rounded-xl border-l-4 border-brand-blue shadow-sm">
                <h4 class="font-bold text-brand-blue text-lg mb-1">
                    <span class="lang-es">${data.label.es}</span>
                    <span class="lang-en hidden-lang">${data.label.en}</span>
                </h4>
                <p class="text-slate-700 dark:text-gray-300 text-sm leading-relaxed">
                    <span class="lang-es">${data.info.es}</span>
                    <span class="lang-en hidden-lang">${data.info.en}</span>
                </p>
            </div>
        `;
        if(window.NCLEX) window.NCLEX.toggleLanguage(); window.NCLEX.toggleLanguage();
    };

    // --- API PÚBLICA & RENDER ---
    
    // Función de limpieza para cuando salimos del módulo
    window.AnatomyCleanup = () => {
        isAnimating = false;
        if (renderer) {
            renderer.dispose();
            const canvas = document.querySelector('canvas');
            if (canvas) canvas.remove();
        }
        window.removeEventListener('resize', Anatomy3D.onResize);
    };

    if (window.NCLEX) {
        window.NCLEX.registerTopic({
            id: 'anatomy',
            title: { es: 'Anatomía Clínica 3D', en: '3D Clinical Anatomy' },
            subtitle: { es: 'Exploración Interactiva', en: 'Interactive Exploration' },
            icon: 'person-rays',
            color: 'teal',
            render: () => {
                // Delay init para asegurar que el DOM exista
                setTimeout(Anatomy3D.init, 100);

                return `
                    <div class="flex flex-col h-[calc(100vh-140px)] gap-4">
                        <div class="flex flex-wrap gap-2 justify-center md:justify-start bg-white dark:bg-[#1c1c1e] p-3 rounded-2xl shadow-sm border border-gray-200 dark:border-white/5">
                            <button onclick="window.AnatomyLoader.loadSystem('cardio')" class="px-4 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 font-bold text-xs uppercase tracking-wider transition-colors">
                                Cardio
                            </button>
                            <button onclick="window.AnatomyLoader.loadSystem('resp')" class="px-4 py-2 bg-green-50 text-green-500 rounded-lg hover:bg-green-100 font-bold text-xs uppercase tracking-wider transition-colors">
                                <span class="lang-es">Resp</span><span class="lang-en hidden-lang">Resp</span>
                            </button>
                            <button onclick="window.AnatomyLoader.loadSystem('neuro')" class="px-4 py-2 bg-purple-50 text-purple-500 rounded-lg hover:bg-purple-100 font-bold text-xs uppercase tracking-wider transition-colors">
                                Neuro
                            </button>
                            <button onclick="window.AnatomyLoader.loadSystem('abd')" class="px-4 py-2 bg-orange-50 text-orange-500 rounded-lg hover:bg-orange-100 font-bold text-xs uppercase tracking-wider transition-colors">
                                Abd
                            </button>
                        </div>

                        <div class="flex-1 relative flex flex-col md:flex-row gap-4 overflow-hidden">
                            <div id="anatomy-canvas" class="flex-1 bg-white dark:bg-black/20 rounded-2xl shadow-inner border border-gray-200 dark:border-white/5 relative overflow-hidden">
                                <div class="absolute inset-0 flex items-center justify-center text-gray-300">
                                    <i class="fa-solid fa-spinner animate-spin text-3xl"></i>
                                </div>
                            </div>

                            <div class="w-full md:w-80 flex flex-col gap-4">
                                <div id="anatomy-info" class="bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-lg flex-1 overflow-y-auto">
                                    <div class="text-center text-gray-400 mt-10">
                                        <i class="fa-solid fa-hand-pointer text-4xl mb-3 opacity-50"></i>
                                        <p class="text-sm">
                                            <span class="lang-es">Haga clic en los puntos de color para ver información clínica.</span>
                                            <span class="lang-en hidden-lang">Click colored nodes to view clinical info.</span>
                                        </p>
                                    </div>
                                </div>
                                
                                <button onclick="window.NCLEX.navigate('home'); window.AnatomyCleanup();" class="w-full py-3 bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-300 transition-colors">
                                    <span class="lang-es">Salir</span>
                                    <span class="lang-en hidden-lang">Exit</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        // Exponer métodos necesarios al objeto global
        window.AnatomyLoader = {
            loadSystem: Anatomy3D.loadSystem
        };
    }

})();
