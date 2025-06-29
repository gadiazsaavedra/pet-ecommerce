let currentFilters = {
    petType: '',
    category: '',
    search: ''
};

let currentPage = 1;

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
    setupSearchDebounce();
    
    // Add loading animation to initial load
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

function setupEventListeners() {
    // Pet type filters
    document.querySelectorAll('.pet-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const petType = this.dataset.pet;
            toggleFilter('petType', petType, this);
        });
    });

    // Category filters
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            toggleFilter('category', category, this);
        });
    });
}

function toggleFilter(filterType, value, element) {
    // Remove active class from siblings
    element.parentNode.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
    
    if (currentFilters[filterType] === value) {
        currentFilters[filterType] = '';
    } else {
        currentFilters[filterType] = value;
        element.classList.add('active');
    }
    
    currentPage = 1;
    loadProducts();
    updateActiveFilters();
}

let searchTimeout;

function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    currentFilters.search = searchInput.value.trim();
    currentPage = 1;
    loadProducts();
    updateActiveFilters();
}

// Add debounced search on input
function setupSearchDebounce() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (this.value.trim() !== currentFilters.search) {
                searchProducts();
            }
        }, 500);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            clearTimeout(searchTimeout);
            searchProducts();
        }
    });
}

function clearFilters() {
    currentFilters = { petType: '', category: '', search: '' };
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
    currentPage = 1;
    loadProducts();
    updateActiveFilters();
}

function updateActiveFilters() {
    const activeFiltersEl = document.getElementById('activeFilters');
    const filters = [];
    
    if (currentFilters.petType) filters.push(`Mascota: ${getPetTypeName(currentFilters.petType)}`);
    if (currentFilters.category) filters.push(`Categoría: ${getCategoryName(currentFilters.category)}`);
    if (currentFilters.search) filters.push(`Búsqueda: ${currentFilters.search}`);
    
    activeFiltersEl.textContent = filters.length ? `Filtros activos: ${filters.join(', ')}` : '';
}

async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    
    try {
        // Show loading state
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><div class="loading">🐾 Cargando productos...</div></div>';
        
        const params = new URLSearchParams({
            page: currentPage,
            limit: 12,
            ...currentFilters
        });

        const response = await fetch(`/api/products?${params}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        displayProducts(data.products);
        displayPagination(data.totalPages, data.currentPage);
        
        // Smooth scroll to top on page change
        if (currentPage > 1) {
            document.querySelector('.content').scrollIntoView({ behavior: 'smooth' });
        }
        
    } catch (error) {
        console.error('Error loading products:', error);
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #ff6b6b;">
                <h3>❌ Error al cargar productos</h3>
                <p>Por favor, intenta nuevamente</p>
                <button onclick="loadProducts()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">Reintentar</button>
            </div>
        `;
    }
}

function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                <h3 style="color: #666; margin-bottom: 0.5rem;">No se encontraron productos</h3>
                <p style="color: #888;">Intenta con otros filtros o términos de búsqueda</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = products.map((product, index) => `
        <div class="product-card" style="animation-delay: ${index * 0.1}s">
            ${product.images && product.images.length > 0 ? 
                `<img src="${product.images[0]}" alt="${product.name}" class="product-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='">`
                : `<div class="product-image" style="background: linear-gradient(45deg, #f0f0f0, #e0e0e0); display: flex; align-items: center; justify-content: center; color: #999; font-size: 2rem;">📷</div>`}
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price.toLocaleString('es-AR', { minimumFractionDigits: 0 })}</div>
            <div class="product-description">${product.description || 'Sin descripción disponible'}</div>
            <div class="product-meta">
                <span>🏷️ ${getCategoryName(product.category)}</span>
                <span>🐾 ${getPetTypeName(product.petType)}</span>
            </div>
            ${product.stock > 0 ? 
                `<div style="margin-top: 1rem; padding: 0.5rem; background: rgba(39, 174, 96, 0.1); border-radius: 8px; text-align: center; color: #27ae60; font-weight: 600;">✓ En stock (${product.stock})</div>` 
                : `<div style="margin-top: 1rem; padding: 0.5rem; background: rgba(231, 76, 60, 0.1); border-radius: 8px; text-align: center; color: #e74c3c; font-weight: 600;">❌ Sin stock</div>`}
        </div>
    `).join('');
    
    // Add fade-in animation
    const cards = grid.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function displayPagination(totalPages, currentPageNum) {
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let buttons = [];
    
    if (currentPageNum > 1) {
        buttons.push(`<button onclick="changePage(${currentPageNum - 1})">Anterior</button>`);
    }
    
    for (let i = Math.max(1, currentPageNum - 2); i <= Math.min(totalPages, currentPageNum + 2); i++) {
        buttons.push(`<button onclick="changePage(${i})" ${i === currentPageNum ? 'class="active"' : ''}>${i}</button>`);
    }
    
    if (currentPageNum < totalPages) {
        buttons.push(`<button onclick="changePage(${currentPageNum + 1})">Siguiente</button>`);
    }
    
    pagination.innerHTML = buttons.join('');
}

function changePage(page) {
    currentPage = page;
    loadProducts();
}

function getPetTypeName(petType) {
    const names = {
        dog: 'Perros',
        cat: 'Gatos',
        bird: 'Aves',
        rodent: 'Roedores',
        reptile: 'Reptiles',
        fish: 'Peces'
    };
    return names[petType] || petType;
}

function getCategoryName(category) {
    const names = {
        beds: 'Cuchas y Camas',
        transport: 'Transporte',
        walking: 'Paseo',
        toys: 'Juguetes',
        food: 'Comida',
        treats: 'Snacks',
        feeders: 'Comederos',
        hygiene: 'Higiene'
    };
    return names[category] || category;
}