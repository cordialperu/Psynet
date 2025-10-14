# 🔄 Cambio de Nombre: PsycheConecta → Psynet

## ✅ Cambios Realizados

Se ha cambiado el nombre de la aplicación de **"PsycheConecta"** a **"Psynet"** en toda la plataforma.

### Archivos Modificados:

#### 1. **package.json**
- ✅ Nombre del proyecto: `"psynet"`

#### 2. **Componentes Frontend**
- ✅ `client/src/components/main-navbar.tsx` - Logo en navbar
- ✅ `client/src/pages/admin/dashboard.tsx` - Sidebar del admin
- ✅ `client/src/pages/home-apple-v3.tsx` - Footer

#### 3. **Documentación**
- ✅ `README.md` - Título principal

### Dónde Aparece el Nombre:

| Ubicación | Antes | Ahora |
|-----------|-------|-------|
| Navbar principal | PsycheConecta | **Psynet** |
| Footer | © 2025 PsycheConecta | © 2025 **Psynet** |
| Sidebar admin | PsycheConecta | **Psynet** |
| package.json | psycheconecta | **psynet** |
| README.md | PsycheConecta | **Psynet** |

---

## 📝 Archivos que AÚN contienen "PsycheConecta"

Los siguientes archivos aún tienen referencias al nombre antiguo pero NO son críticos:

### Versiones Antiguas de Páginas (No se usan):
- `client/src/pages/home-professionals.tsx`
- `client/src/pages/home-elegant.tsx`
- `client/src/pages/home-natural.tsx`
- `client/src/pages/home-directory.tsx`
- `client/src/pages/home-final.tsx`
- `client/src/pages/home.tsx`
- `client/src/pages/home-apple.tsx`
- `client/src/pages/home-apple-v2.tsx`

### Componentes No Utilizados:
- `client/src/components/navbar-psychedelic.tsx`
- `client/src/components/navbar-v2.tsx`
- `client/src/components/navbar.tsx`
- `client/src/components/footer.tsx`

### Documentación y Scripts:
- `REVIEW_SUMMARY.md`
- `design_guidelines.md`
- `replit.md`
- `NUEVO_DISEÑO.md`
- `SETUP_GUIDE.md`
- `scripts/seed-15-therapies.ts`
- `scripts/seed-final.ts`

**Nota:** Estos archivos son versiones antiguas o documentación histórica. No afectan la aplicación en producción.

---

## 🎯 Nombre Visible para el Usuario

El usuario verá **"Psynet"** en:

1. **Navbar** (parte superior de todas las páginas)
2. **Footer** (parte inferior de la página principal)
3. **Panel de Administración** (sidebar)
4. **Título del navegador** (si se configura en index.html)

---

## 🔧 Cambios Adicionales Opcionales

Si quieres cambiar el nombre en TODOS los archivos (incluyendo los no utilizados):

```bash
# Buscar todas las ocurrencias
grep -r "PsycheConecta" client/src/

# Reemplazar en todos los archivos
find client/src/ -type f -name "*.tsx" -exec sed -i '' 's/PsycheConecta/Psynet/g' {} +
find client/src/ -type f -name "*.ts" -exec sed -i '' 's/PsycheConecta/Psynet/g' {} +
```

---

## ✅ Verificación

Para verificar que el cambio se aplicó correctamente:

1. **Página Principal**: `http://localhost:5001`
   - Navbar debe mostrar "Psynet"
   - Footer debe mostrar "© 2025 Psynet"

2. **Panel Admin**: `http://localhost:5001/admin/dashboard`
   - Sidebar debe mostrar "Psynet"

3. **Panel Guía**: `http://localhost:5001/guia/dashboard`
   - Navbar debe mostrar "Psynet"

---

## 📱 Título del Navegador

Para cambiar el título que aparece en la pestaña del navegador, edita:

**`client/index.html`**
```html
<title>Psynet - Ceremonias de Medicina Ancestral</title>
```

---

**¡El cambio de nombre está completo!** 🎉

Todos los lugares visibles para el usuario ahora muestran **"Psynet"**.
