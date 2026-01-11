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
        console.log("Prods: " + vs.addProduction(mov1)); // Añadir producción suelta

        console.log("--- Añadiendo Actores y Directores ---");
        console.log("Directors: " + vs.addDirector(p1));
        console.log("Actors: " + vs.addActor(p2));

        // 4. Asignaciones (Aquí es donde la magia ocurre)
        console.log("--- Asignando Relaciones ---");
        // Asignar Pulp Fiction a Acción
        vs.assignCategory(catAccion, mov1);
        // Asignar Tarantino como director de Pulp Fiction
        vs.assignDirector(p1, mov1);
        // Asignar Brad Pitt a Pulp Fiction
        vs.assignActor(p2, mov1);
        // Asignar Uma Thurman (No estaba añadida, el sistema debería añadirla sola)
        vs.assignActor(p3, mov1); 

        // 5. Comprobación de Iteradores (Búsquedas)
        console.log("--- BÚSQUEDAS (Iteradores) ---");
        
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

        console.log("Producciones de Tarantino:");
        let itDir = vs.getProductionsDirector(p1);
        let dProd = itDir.next();
        while (!dProd.done) {
            console.log(" -> " + dProd.value.toString());
            dProd = itDir.next();
        }

        // 6. Prueba de Errores
        console.log("--- Prueba de Errores ---");
        try {
            vs.addCategory(catAccion); // Ya existe
        } catch (e) {
            console.error("Error capturado correctamente: " + e.message);
        }

        try {
            let pFail = new Production("Titulo", "Nacion", new Date(), "Syn", "Img"); // Clase abstracta
        } catch (e) {
            console.error("Error capturado (Abstracta): " + e.message);
        }

    } catch (e) {
        console.error("ERROR CRÍTICO: " + e);
    }

    console.log("=== FIN TEST ===");
}

testVideoSystem();