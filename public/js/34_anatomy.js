// ============================================================================
// SISTEMA DE INYECCIÓN MEJORADO
// ============================================================================

(function() {
    console.log('🚀 Cargando módulo de Anatomía...');
    
    // Crear instancia del módulo
    const anatomyModule = new AnatomyTitanium();
    window.NCLEX_TITANIUM = anatomyModule;
    
    // Función para registrar el módulo en el sistema NCLEX
    function registerWithNCLEX() {
        if (window.NCLEX && window.NCLEX.registerTopic) {
            console.log('✅ Registrando módulo de anatomía en NCLEX...');
            window.NCLEX.registerTopic({
                id: anatomyModule.id,
                title: { es: 'Anatomía Clínica', en: 'Clinical Anatomy' },
                icon: 'heart-pulse',
                color: 'blue',
                render: () => {
                    setTimeout(() => anatomyModule.init(), 50);
                    return anatomyModule.render();
                }
            });
            return true;
        }
        return false;
    }
    
    // Función para inyectar el botón directamente
    function injectButton() {
        const nav = document.getElementById('topics-nav');
        if (!nav) {
            console.log('⚠️ No se encontró el menú de temas (topics-nav)');
            return false;
        }
        
        // Verificar si el botón ya existe
        if (document.getElementById('btn-anatomy-force')) {
            console.log('✅ El botón de anatomía ya existe');
            return true;
        }
        
        console.log('⚠️ Inyectando botón de anatomía directamente...');
        
        const button = document.createElement('button');
        button.id = 'btn-anatomy-force';
        button.className = 'nav-btn w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-900/20 to-transparent border border-blue-800/30 hover:bg-blue-900/40 transition-all text-blue-400 group mb-2';
        button.onclick = () => {
            // Limpiar active states
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active', 'bg-blue-50', 'text-brand-blue'));
            button.classList.add('active');
            
            // Renderizar
            const view = document.getElementById('app-view');
            if (view) {
                view.innerHTML = anatomyModule.render();
                anatomyModule.init();
            }
        };
        
        button.innerHTML = `
            <div class="w-6 flex justify-center">
                <i class="fa-solid fa-heart-pulse text-xl text-blue-500 animate-pulse"></i>
            </div>
            <span class="hidden lg:block text-base font-bold">Anatomía Clínica</span>
        `;
        
        // Insertar al principio del menú
        nav.prepend(button);
        console.log('✅ Botón de anatomía inyectado');
        return true;
    }
    
    // Intentar registro e inyección
    function attemptIntegration() {
        let registered = registerWithNCLEX();
        
        if (!registered) {
            console.log('⚠️ No se pudo registrar en NCLEX, intentando inyección directa...');
            injectButton();
        }
    }
    
    // Esperar a que el DOM esté listo y que NCLEX esté disponible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attemptIntegration);
    } else {
        // Si el DOM ya está listo, intentar inmediatamente
        attemptIntegration();
    }
    
    // También intentar después de un retraso por si NCLEX se carga después
    setTimeout(attemptIntegration, 1000);
    setTimeout(attemptIntegration, 3000);
    
    console.log('✅ Módulo de anatomía cargado');
})();
