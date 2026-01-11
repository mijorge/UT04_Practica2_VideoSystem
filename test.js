/*
 * Pruebas del VideoSystem
 */

function testVideoSystem() {
    console.log("=== INICIO TEST VIDEOSYSTEM ===");

    try {
        // 1. Instanciar Sistema (Singleton)
        let vs = VideoSystem.getInstance("Mi Netflix");
        console.log("Sistema creado: " + vs.name);

        // 2. Crear objetos
        let catAccion = new Category("Acción", "Pelis de tiros");
        let catDrama = new Category("Drama", "Pelis de llorar");

        let p1 = new Person("Quentin", "Tarantino", new Date(1963, 2, 27));
        let p2 = new Person("Brad", "Pitt", new Date(1963, 11, 18));
        let p3 = new Person("Uma", "Thurman", new Date(1970, 3, 29));

        let res1 = new Resource(154, "pulpfiction.mp4");
        let mov1 = new Movie("Pulp Fiction", "USA", new Date(1994, 9, 14), "Violencia y redención", "pulp.jpg", res1);

        let user1 = new User("usuario1", "u1@email.com", "pass123");

        // 3. Añadir al sistema
        console.log("--- Añadiendo Categorías, Usuarios y Producciones ---");
        console.log("Cats: " + vs.addCategory(catAccion));
        console.log("Users: " + vs.addUser(user1));
        console.log("Prods: " + vs.addProduction(mov1)); 

        console.log("--- Añadiendo Actores y Directores ---");
        console.log("Directors: " + vs.addDirector(p1));
        console.log("Actors: " + vs.addActor(p2));

        // 4. Asignaciones (Aquí es donde la magia ocurre)
        console.log("--- Asignando Relaciones ---");
        vs.assignCategory(catAccion, mov1);
        vs.assignDirector(p1, mov1);
        vs.assignActor(p2, mov1);
        vs.assignActor(p3, mov1); 

        // 5. Comprobación de Iteradores y Búsquedas
        console.log("--- BÚSQUEDAS Y GETTERS ---");
        
        // Probamos el nuevo método getProduction
        console.log("Buscando 'Pulp Fiction' por título...");
        let pFound = vs.getProduction("Pulp Fiction");
        console.log("Encontrada: " + pFound.toString());

        console.log("Producciones de Acción:");
        let itProd = vs.getProductionsCategory(catAccion);
        let prod = itProd.next();
        while (!prod.done) {
            console.log(" -> " + prod.value.toString());
            prod = itProd.next();
        }

        console.log("Reparto (Cast) de Pulp Fiction:");
        let itCast = vs.getCast(mov1);
        let actor = itCast.next();
        while (!actor.done) {
            console.log(" -> " + actor.value.toString());
            actor = itCast.next();
        }

        // 6. Prueba de Errores
        console.log("--- Prueba de Errores ---");
        try {
            vs.addCategory(catAccion); // Ya existe
        } catch (e) {
            console.error("Error capturado correctamente: " + e.message);
        }

        try {
            vs.getProduction("Titanic"); // No existe
        } catch (e) {
            console.error("Error de no encontrado capturado: " + e.message);
        }

    } catch (e) {
        console.error("ERROR CRÍTICO: " + e);
    }

    console.log("=== FIN TEST ===");
}

testVideoSystem();