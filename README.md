# Pet E-commerce Platform

Plataforma de e-commerce especializada en artículos para mascotas con importación automática desde Excel.

## Estructura del Proyecto

### Categorías Principales
- **Mascotas Domésticas**: Perros y Gatos
- **Animales Exóticos**: Aves, Roedores, Reptiles, Acuario

### Categorías de Productos
- Cuchas y Camas
- Transporte (Jaulas, bolsos)
- Paseo (Correas, arneses, collares)
- Juguetes
- Comida
- Snacks
- Comederos y Bebederos
- Accesorios de Higiene

## Instalación

```bash
npm install
```

## Configuración

1. Instalar MongoDB localmente o usar MongoDB Atlas
2. Configurar variables de entorno en `.env`

## Uso

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Importar Datos desde Excel

POST `/api/import-excel` - Importa productos desde el archivo Excel

## API Endpoints

- `GET /api/products` - Lista productos con filtros
- `GET /api/products/categories` - Obtiene categorías disponibles
- `GET /api/products/category/:category` - Productos por categoría

### Parámetros de Filtrado
- `category`: Categoría del producto
- `petType`: Tipo de mascota (dog, cat, bird, rodent, reptile, fish)
- `search`: Búsqueda por texto
- `page`: Página (paginación)
- `limit`: Límite por página