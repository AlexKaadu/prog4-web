// Buscar por artículo
const buscador = document.getElementById("filtro-articulo");

buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase().trim();
    const filas = document.querySelectorAll("#tabla-articulos-datos tr");

    filas.forEach(fila => {
        const nombreArticulo = fila.cells[1].textContent.toLowerCase();
        
        fila.style.display = nombreArticulo.includes(texto) ? "" : "none";
    });
});

// Buscar por categoría
const categorias = {
    0: "Todas las categorías",
    1: "Periféricos",
    2: "Notebooks",
    3: "PC-Escritorio",
    4: "Almacenamiento",
    5: "Equipos de Red"
};

const opcion = document.getElementById("filtro-categoria");

opcion.addEventListener("change", () => {
    const categoriaSel = categorias[opcion.value];
    const filas = document.querySelectorAll("#tabla-articulos-datos tr");
    
    filas.forEach(fila => {
        const categoria = fila.cells[2].textContent;

        if (opcion.value === "0") {
            fila.style.display = "";
        } else {
            fila.style.display = (categoria === categoriaSel) ? "" : "none";
        }
    });
    
});
