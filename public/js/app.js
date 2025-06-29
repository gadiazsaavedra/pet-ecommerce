let currentFilters = {
    petType: '',
    category: '',
    search: ''
};

let currentPage = 1;

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
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

function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    currentFilters.search = searchInput.value;
    currentPage = 1;
    loadProducts();
    updateActiveFilters();
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
    try {
        const params = new URLSearchParams({
            page: currentPage,
            limit: 12,
            ...currentFilters
        });

        const response = await fetch(`/api/products?${params}`);
        const data = await response.json();
        
        displayProducts(data.products);
        displayPagination(data.totalPages, data.currentPage);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">No se encontraron productos</div>';
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            ${product.images && product.images.length > 0 ? 
                `<img src="${product.images[0]}" alt="${product.name}" class="product-image">` : ''}
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-description">${product.description || ''}</div>
            <div class="product-meta">
                <span>${getCategoryName(product.category)}</span>
                <span>${getPetTypeName(product.petType)}</span>
            </div>
        </div>
    `).join('');
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