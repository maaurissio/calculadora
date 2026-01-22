// Funciones para la zona de apuntes
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('preview-img');
            const preview = document.getElementById('image-preview');
            const placeholder = preview.querySelector('.placeholder-text');
            const btnRemove = document.getElementById('btn-remove-img');
            
            img.src = e.target.result;
            img.style.display = 'block';
            if (placeholder) placeholder.style.display = 'none';
            preview.classList.add('has-image');
            btnRemove.style.display = 'block';
            
            // Guardar en localStorage
            localStorage.setItem('workImage', e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

// Funciones para el modal de imagen
function openImageModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const previewImg = document.getElementById('preview-img');
    
    modal.classList.add('show');
    modalImg.src = previewImg.src;
    document.body.style.overflow = 'hidden'; // Prevenir scroll
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restaurar scroll
}

// Cerrar modal con tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeImageModal();
    }
});

function removeImage() {
    const img = document.getElementById('preview-img');
    const preview = document.getElementById('image-preview');
    const placeholder = preview.querySelector('.placeholder-text');
    const btnRemove = document.getElementById('btn-remove-img');
    const fileInput = document.getElementById('image-input');
    
    img.src = '';
    img.style.display = 'none';
    if (placeholder) placeholder.style.display = 'block';
    preview.classList.remove('has-image');
    btnRemove.style.display = 'none';
    fileInput.value = '';
    
    // Limpiar de localStorage
    localStorage.removeItem('workImage');
}

function clearNotes() {
    showConfirmModal(
        '¿Limpiar trabajo?',
        '¿Seguro que quieres limpiar todo?',
        ['Las notas de texto', 'La imagen adjunta'],
        function() {
            // Limpiar imagen
            removeImage();
            
            // Limpiar notas de texto
            document.getElementById('work-notes').value = '';
            localStorage.removeItem('workNotes');
        }
    );
}

// ==================== MODAL DE CONFIRMACIÓN ====================
let confirmCallback = null;

function showConfirmModal(title, message, listItems, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    const titleEl = document.getElementById('confirm-title');
    const messageEl = document.getElementById('confirm-message');
    const listEl = document.getElementById('confirm-list');
    
    titleEl.textContent = title || 'CONFIRMAR';
    messageEl.textContent = message || '¿Estás seguro?';
    
    // Limpiar y llenar la lista
    listEl.innerHTML = '';
    if (listItems && listItems.length > 0) {
        listItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            listEl.appendChild(li);
        });
    }
    
    confirmCallback = onConfirm;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeConfirmModal(confirmed) {
    const modal = document.getElementById('confirm-modal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    if (confirmed && typeof confirmCallback === 'function') {
        confirmCallback();
    }
    confirmCallback = null;
}

// Función para procesar imagen desde el portapapeles
function handlePastedImage(blob) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.getElementById('preview-img');
        const preview = document.getElementById('image-preview');
        const placeholder = preview.querySelector('.placeholder-text');
        const btnRemove = document.getElementById('btn-remove-img');
        
        img.src = e.target.result;
        img.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
        preview.classList.add('has-image');
        btnRemove.style.display = 'block';
        
        // Guardar en localStorage
        localStorage.setItem('workImage', e.target.result);
    };
    reader.readAsDataURL(blob);
}

// Click en el área de imagen para abrir selector
document.addEventListener('DOMContentLoaded', function() {
    const preview = document.getElementById('image-preview');
    const fileInput = document.getElementById('image-input');
    const workNotes = document.getElementById('work-notes');
    
    // Evento paste global para capturar Ctrl+V
    document.addEventListener('paste', function(e) {
        const items = e.clipboardData?.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    e.preventDefault();
                    const blob = items[i].getAsFile();
                    handlePastedImage(blob);
                    break;
                }
            }
        }
    });
    
    // También permitir paste específico en el área de imagen
    preview.addEventListener('paste', function(e) {
        const items = e.clipboardData?.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    e.preventDefault();
                    const blob = items[i].getAsFile();
                    handlePastedImage(blob);
                    break;
                }
            }
        }
    });
    
    // Click para seleccionar imagen
    preview.addEventListener('click', function(e) {
        if (!preview.classList.contains('has-image')) {
            fileInput.click();
        }
    });
    
    // Drag and drop para imagen
    preview.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        preview.style.borderColor = '#00d4ff';
    });
    
    preview.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        preview.style.borderColor = 'rgba(0, 212, 255, 0.3)';
    });
    
    preview.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        preview.style.borderColor = 'rgba(0, 212, 255, 0.3)';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            fileInput.files = e.dataTransfer.files;
            handleImageUpload({ target: fileInput });
        }
    });
    
    // Guardar notas de texto en localStorage
    workNotes.addEventListener('input', function() {
        localStorage.setItem('workNotes', workNotes.value);
    });
    
    // Restaurar datos guardados
    const savedImage = localStorage.getItem('workImage');
    if (savedImage) {
        const img = document.getElementById('preview-img');
        const previewDiv = document.getElementById('image-preview');
        const placeholder = previewDiv.querySelector('.placeholder-text');
        const btnRemove = document.getElementById('btn-remove-img');
        
        img.src = savedImage;
        img.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
        previewDiv.classList.add('has-image');
        btnRemove.style.display = 'block';
    }
    
    const savedNotes = localStorage.getItem('workNotes');
    if (savedNotes) {
        workNotes.value = savedNotes;
    }
    
    calculateTotal();
});

// Funciones para cupón
function toggleCoupon() {
    const checkbox = document.getElementById('coupon-checkbox');
    const inputArea = document.getElementById('coupon-input-area');
    
    if (checkbox.checked) {
        inputArea.classList.remove('hidden');
        document.getElementById('coupon-percentage').value = 10; // Default 10%
    } else {
        inputArea.classList.add('hidden');
        document.getElementById('coupon-percentage').value = 0;
    }
    calculateTotal();
}

function incrementCoupon() {
    const input = document.getElementById('coupon-percentage');
    if (parseInt(input.value) < 100) {
        input.value = parseInt(input.value) + 5;
        calculateTotal();
    }
}

function decrementCoupon() {
    const input = document.getElementById('coupon-percentage');
    if (parseInt(input.value) > 0) {
        input.value = parseInt(input.value) - 5;
        calculateTotal();
    }
}

// Funciones para incrementar/decrementar valores
function incrementValue(id) {
    const input = document.getElementById(id);
    const max = input.max ? parseInt(input.max) : Infinity;
    if (parseInt(input.value) < max) {
        input.value = parseInt(input.value) + 1;
        calculateTotal();
    }
}

function decrementValue(id) {
    const input = document.getElementById(id);
    if (parseInt(input.value) > 0) {
        input.value = parseInt(input.value) - 1;
        calculateTotal();
    }
}

// Mostrar/ocultar opciones personalizadas de rendimiento
function toggleCustomRendimiento() {
    const customDiv = document.getElementById('rendimiento-custom');
    const customRadio = document.querySelector('input[name="rendimiento"][value="custom"]');
    
    if (customRadio.checked) {
        customDiv.classList.remove('hidden');
        if (document.getElementById('rendimiento-piezas').value === '0') {
            document.getElementById('rendimiento-piezas').value = 1;
        }
    } else {
        customDiv.classList.add('hidden');
        document.getElementById('rendimiento-piezas').value = 0;
    }
    calculateTotal();
}

// Mostrar/ocultar kit de reparación
function toggleKitReparacion() {
    const kitDiv = document.getElementById('kit-reparacion');
    const kitCheckbox = document.getElementById('kit-checkbox');
    
    if (kitCheckbox.checked) {
        kitDiv.classList.remove('hidden');
        if (document.getElementById('kit-personas').value === '0') {
            document.getElementById('kit-personas').value = 1;
        }
    } else {
        kitDiv.classList.add('hidden');
        document.getElementById('kit-personas').value = 0;
    }
    calculateTotal();
}

// Mostrar/ocultar piezas de mantención por parte
function toggleMantencionPorParte() {
    const customDiv = document.getElementById('mantencion-custom');
    const porParteRadio = document.querySelector('input[name="mantencion"][value="por-parte"]');
    
    if (porParteRadio.checked) {
        customDiv.classList.remove('hidden');
        if (document.getElementById('mantencion-piezas').value === '0') {
            document.getElementById('mantencion-piezas').value = 1;
        }
    } else {
        customDiv.classList.add('hidden');
        document.getElementById('mantencion-piezas').value = 0;
    }
    calculateTotal();
}

// Calcular el total
function calculateTotal() {
    let total = 0;

    // TUNEO - Concesionario $1600, Sangre $3500 por pieza
    const tuneoTipo = document.querySelector('input[name="tuneo-tipo"]:checked').value;
    const tuneo = parseInt(document.getElementById('tuneo').value) || 0;
    const tuneoPrice = tuneoTipo === 'sangre' ? 3500 : 1600;
    total += tuneo * tuneoPrice;
    
    // Actualizar texto del precio
    const tuneoPriceEl = document.getElementById('tuneo-price');
    if (tuneoPriceEl) {
        tuneoPriceEl.textContent = tuneoTipo === 'sangre' ? '$3.500 c/u' : '$1.600 c/u';
    }

    // RENDIMIENTO - Concesionario Full $6000, Sangre Full $12000
    const rendimientoTipo = document.querySelector('input[name="rendimiento-tipo"]:checked').value;
    const rendimiento = document.querySelector('input[name="rendimiento"]:checked').value;
    const rendimientoFullPrice = rendimientoTipo === 'sangre' ? 12000 : 6000;
    
    // Actualizar texto del precio full
    const rendimientoFullPriceEl = document.getElementById('rendimiento-full-price');
    if (rendimientoFullPriceEl) {
        rendimientoFullPriceEl.textContent = rendimientoTipo === 'sangre' ? '$12.000' : '$6.000';
    }
    
    if (rendimiento === 'full') {
        total += rendimientoFullPrice;
    } else if (rendimiento === 'custom') {
        const piezas = parseInt(document.getElementById('rendimiento-piezas').value) || 0;
        total += piezas * 1000;
    }

    // MOTOS - Concesionario Full $4000, Sangre Full $8000
    const motosTipo = document.querySelector('input[name="motos-tipo"]:checked').value;
    const motos = document.querySelector('input[name="motos"]:checked').value;
    const motosFullPrice = motosTipo === 'sangre' ? 8000 : 4000;
    
    // Actualizar texto del precio full
    const motosFullPriceEl = document.getElementById('motos-full-price');
    if (motosFullPriceEl) {
        motosFullPriceEl.textContent = motosTipo === 'sangre' ? '$8.000' : '$4.000';
    }
    
    if (motos === 'full') {
        total += motosFullPrice;
    }

    // REPARACIÓN
    const reparacionCheckbox = document.getElementById('reparacion-checkbox');
    if (reparacionCheckbox && reparacionCheckbox.checked) {
        total += 6000;
    }
    
    // KIT DE REPARACIÓN
    const kitCheckbox = document.getElementById('kit-checkbox');
    if (kitCheckbox && kitCheckbox.checked) {
        const kits = parseInt(document.getElementById('kit-personas').value) || 0;
        total += kits * 8000;
    }

    // NEUMÁTICO
    const neumatico = document.querySelector('input[name="neumatico"]:checked').value;
    if (neumatico === '10000' || neumatico === '10000-slick') {
        total += 10000;
    } else if (neumatico === '5000') {
        total += 5000;
    }

    // MANTENCIÓN
    const mantencion = document.querySelector('input[name="mantencion"]:checked').value;
    if (mantencion === '8000') {
        total += 8000;
    } else if (mantencion === 'por-parte') {
        const piezas = parseInt(document.getElementById('mantencion-piezas').value) || 0;
        total += piezas * 1500;
    }

    // Aplicar descuento de cupón
    const couponCheckbox = document.getElementById('coupon-checkbox');
    let discount = 0;
    let subtotal = total;
    
    if (couponCheckbox && couponCheckbox.checked) {
        const percentage = parseInt(document.getElementById('coupon-percentage').value) || 0;
        discount = Math.round((total * percentage) / 100);
        total = total - discount;
    }

    // Mostrar total formateado
    const totalElement = document.getElementById('total');
    if (discount > 0) {
        totalElement.innerHTML = `
            <div style="font-size: 0.5em; color: rgba(255,255,255,0.6); text-decoration: line-through;">
                Subtotal: $${subtotal.toLocaleString('es-CL')}
            </div>
            <div style="font-size: 0.5em; color: #ffd700;">
                Descuento: -$${discount.toLocaleString('es-CL')}
            </div>
            $${total.toLocaleString('es-CL')}
        `;
    } else {
        totalElement.textContent = '$' + total.toLocaleString('es-CL');
    }
}

// Resetear calculadora
function resetCalculator() {
    // Resetear inputs de número
    document.getElementById('tuneo').value = 0;
    document.getElementById('rendimiento-piezas').value = 0;
    document.getElementById('kit-personas').value = 0;
    document.getElementById('mantencion-piezas').value = 0;

    // Resetear radios de tipo de vehículo a concesionario
    document.querySelectorAll('input[name="tuneo-tipo"][value="concesionario"]').forEach(r => r.checked = true);
    document.querySelectorAll('input[name="rendimiento-tipo"][value="concesionario"]').forEach(r => r.checked = true);
    document.querySelectorAll('input[name="motos-tipo"][value="concesionario"]').forEach(r => r.checked = true);

    // Resetear radios de servicios
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        if (radio.value === '0') {
            radio.checked = true;
        } else if (radio.name !== 'tuneo-tipo' && radio.name !== 'rendimiento-tipo' && radio.name !== 'motos-tipo') {
            radio.checked = false;
        }
    });
    
    // Resetear checkboxes de reparación
    document.getElementById('reparacion-checkbox').checked = false;
    document.getElementById('kit-checkbox').checked = false;

    // Ocultar opciones personalizadas
    document.getElementById('rendimiento-custom').classList.add('hidden');
    document.getElementById('kit-reparacion').classList.add('hidden');
    document.getElementById('mantencion-custom').classList.add('hidden');

    // Resetear cupón
    document.getElementById('coupon-checkbox').checked = false;
    document.getElementById('coupon-percentage').value = 0;
    document.getElementById('coupon-input-area').classList.add('hidden');

    // Recalcular total
    calculateTotal();
}

// Resetear todo (incluye apuntes e imagen)
function resetAll() {
    showConfirmModal(
        '¿BORRAR TODO?',
        '¿Seguro que quieres resetear TODO?',
        ['La calculadora completa', 'Los apuntes de trabajo', 'La imagen adjunta', 'El cupón de descuento'],
        function() {
            // Resetear calculadora
            resetCalculator();
            
            // Limpiar imagen y notas
            removeImage();
            document.getElementById('work-notes').value = '';
            localStorage.removeItem('workNotes');
        }
    );
}

// Funciones para el tema oscuro
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    // Si está en light, quitamos el atributo (vuelve a oscuro base)
    // Si no tiene o es dark, ponemos light
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    if (newTheme === 'dark') {
        html.removeAttribute('data-theme');
    } else {
        html.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');
    
    if (theme === 'light') {
        icon.textContent = '🌙';
        text.textContent = '暗い'; // Kurai = Oscuro
    } else {
        icon.textContent = '☀️';
        text.textContent = '明るい'; // Akarui = Claro/Brillante
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeButton('light');
    } else {
        // Por defecto modo oscuro (sin atributo, usa :root)
        updateThemeButton('dark');
    }
}

// Exponer funciones al objeto window para que estén disponibles globalmente
window.toggleTheme = toggleTheme;
window.clearNotes = clearNotes;
window.removeImage = removeImage;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.handleImageUpload = handleImageUpload;
window.incrementValue = incrementValue;
window.decrementValue = decrementValue;
window.toggleCustomRendimiento = toggleCustomRendimiento;
window.toggleKitReparacion = toggleKitReparacion;
window.toggleMantencionPorParte = toggleMantencionPorParte;
window.toggleCoupon = toggleCoupon;
window.incrementCoupon = incrementCoupon;
window.decrementCoupon = decrementCoupon;
window.calculateTotal = calculateTotal;
window.resetCalculator = resetCalculator;
window.resetAll = resetAll;

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    calculateTotal();
});
