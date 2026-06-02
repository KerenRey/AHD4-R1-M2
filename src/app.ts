type EstadoLectura = "Leido" | "Pendiente";

class Libro {
    constructor(
        public titulo: string,
        public autor: string,
        public categoria: string,
        public imagen: string,
        public anio: number,
        public estado: EstadoLectura
    ) {}

    coincideCon(busqueda: string): boolean {
        const texto = `${this.titulo} ${this.autor} ${this.categoria} ${this.anio} ${this.estado}`.toLowerCase();
        return texto.includes(busqueda.toLowerCase());
    }
}

class Biblioteca {
    private libros: Libro[] = [];

    constructor(
        private formulario: HTMLFormElement,
        private contenedor: HTMLElement,
        private buscador: HTMLInputElement,
        private contador: HTMLElement
    ) {
        this.activarEventos();
        this.renderizar();
    }

    private activarEventos(): void {
        this.formulario.addEventListener("submit", (evento) => {
            evento.preventDefault();
            this.agregarLibroDesdeFormulario();
        });

        this.buscador.addEventListener("input", () => {
            this.renderizar(this.buscador.value);
        });
    }

    private agregarLibroDesdeFormulario(): void {
        const titulo = obtenerInput("titulo").value.trim();
        const autor = obtenerInput("autor").value.trim();
        const categoria = obtenerInput("categoria").value.trim();
        const imagen = obtenerInput("imagen").value.trim();
        const anio = Number(obtenerInput("anio").value);
        const estado = obtenerSelect("estado").value as EstadoLectura;

        if (!titulo || !autor || !categoria || !anio || !estado) {
            alert("Completa todos los campos obligatorios.");
            return;
        }

        const libro = new Libro(titulo, autor, categoria, imagen, anio, estado);
        this.libros.push(libro);

        this.formulario.reset();
        this.renderizar(this.buscador.value);
    }

    private eliminarLibro(indiceReal: number): void {
        this.libros.splice(indiceReal, 1);
        this.renderizar(this.buscador.value);
    }

    private renderizar(busqueda: string = ""): void {
        this.contenedor.innerHTML = "";

        const librosFiltrados = this.libros
            .map((libro, indice) => ({ libro, indice }))
            .filter(({ libro }) => libro.coincideCon(busqueda));

        this.contador.textContent = `Total de libros registrados: ${this.libros.length}`;

        if (librosFiltrados.length === 0) {
            this.contenedor.innerHTML = `<p class="empty-message">No hay libros para mostrar.</p>`;
            return;
        }

        librosFiltrados.forEach(({ libro, indice }) => {
            const tarjeta = document.createElement("article");
            tarjeta.className = "book-card";

            const portada = document.createElement("img");
            portada.src = libro.imagen || "img/libro.jpg";
            portada.alt = `Portada de ${libro.titulo}`;

            const informacion = document.createElement("div");
            informacion.className = "book-info";
            informacion.innerHTML = `
                <h3>${libro.titulo}</h3>
                <p>${libro.autor}</p>
                <p>Año: ${libro.anio}</p>
                <span>${libro.categoria}</span> 
                <br>
                <span>${libro.estado}</span>
            `;

            const botonEliminar = document.createElement("button");
            botonEliminar.className = "delete-btn";
            botonEliminar.textContent = "Eliminar";
            botonEliminar.addEventListener("click", () => this.eliminarLibro(indice));

            tarjeta.append(portada, informacion, botonEliminar);
            this.contenedor.appendChild(tarjeta);
        });
    }
}

function obtenerInput(id: string): HTMLInputElement {
    const elemento = document.getElementById(id);

    if (!(elemento instanceof HTMLInputElement)) {
        throw new Error(`No se encontró el input con id "${id}".`);
    }

    return elemento;
}

function obtenerSelect(id: string): HTMLSelectElement {
    const elemento = document.getElementById(id);

    if (!(elemento instanceof HTMLSelectElement)) {
        throw new Error(`No se encontró el select con id "${id}".`);
    }

    return elemento;
}

function prepararCamposDelEjercicio(formulario: HTMLFormElement): void {
    if (!document.getElementById("anio")) {
        const inputAnio = document.createElement("input");
        inputAnio.type = "number";
        inputAnio.id = "anio";
        inputAnio.placeholder = "Ano de publicacion";
        inputAnio.required = true;
        inputAnio.min = "1";
        inputAnio.max = String(new Date().getFullYear());

        const boton = formulario.querySelector("button");
        formulario.insertBefore(inputAnio, boton);
    }

    if (!document.getElementById("estado")) {
        const selectEstado = document.createElement("select");
        selectEstado.id = "estado";
        selectEstado.required = true;
        selectEstado.innerHTML = `
            <option value="">Estado de lectura</option>
            <option value="Leido">Leido</option>
            <option value="Pendiente">Pendiente</option>
        `;

        const boton = formulario.querySelector("button");
        formulario.insertBefore(selectEstado, boton);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("bookForm") as HTMLFormElement | null;
    const contenedor = document.getElementById("booksContainer");
    const buscador = document.getElementById("search") as HTMLInputElement | null;

    if (!formulario || !contenedor || !buscador) {
        throw new Error("Faltan elementos necesarios en el HTML.");
    }

    prepararCamposDelEjercicio(formulario);

    const contador = document.createElement("p");
    contador.id = "bookCounter";
    contador.className = "book-counter";
    contenedor.before(contador);

    new Biblioteca(formulario, contenedor, buscador, contador);
});
