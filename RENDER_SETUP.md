# Configuración de Render para Pet Store

## Problema identificado
Tu aplicación no muestra productos porque la base de datos MongoDB está vacía.

## Solución paso a paso:

### 1. Verificar el estado actual
Visita: `https://pet-ecommerce-1.onrender.com/api/status`

Esto te mostrará:
- Estado de conexión a MongoDB
- Cantidad de productos en la base de datos
- Si la variable MONGODB_URI está configurada

### 2. Configurar variables de entorno en Render

1. Ve a tu dashboard de Render
2. Selecciona tu servicio "pet-ecommerce-1"
3. Ve a la pestaña "Environment"
4. Agrega/verifica estas variables:

```
MONGODB_URI=tu_uri_de_mongodb_atlas
PORT=10000
```

**Importante**: Asegúrate de que tu MONGODB_URI sea de MongoDB Atlas, no localhost.

### 3. Poblar la base de datos

Una vez configurada la variable MONGODB_URI, visita:
`https://pet-ecommerce-1.onrender.com/api/seed`

Esto agregará productos de ejemplo a tu base de datos.

### 4. Verificar que funciona

Después de poblar la base de datos, visita:
`https://pet-ecommerce-1.onrender.com`

Deberías ver los productos cargados.

## Endpoints útiles para debugging:

- `/api/status` - Estado de la base de datos
- `/api/seed` - Poblar con datos de ejemplo
- `/api/products` - Ver todos los productos (JSON)

## Si sigues teniendo problemas:

1. Verifica que tu MongoDB Atlas permita conexiones desde cualquier IP (0.0.0.0/0)
2. Asegúrate de que el usuario de MongoDB tenga permisos de lectura/escritura
3. Revisa los logs de Render para errores de conexión