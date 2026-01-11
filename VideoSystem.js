/*
 * UT04 Práctica 2: VideoSystem (Singleton)
 * Descripción: Gestor principal del sistema.
 */

const VideoSystem = (function () {
    let instantiated;

    function init(name) {
        // Propiedades Privadas del Sistema
        let _name = name;
        let _users = [];
        
        // Estructuras para guardar relaciones.
        // Usamos arrays de objetos para guardar { category: obj, productions: [] }
        let _categories = []; 
        let _productions = []; // Array simple de producciones para búsqueda rápida
        let _directors = [];
        let _actors = [];

        // --- MÉTODOS PRIVADOS AUXILIARES ---
        function getCategoryPos(category) {
            return _categories.findIndex(c => c.category.name === category.name);
        }
        function getDirectorPos(director) {
            return _directors.findIndex(d => d.director.name === director.name);
        }
        function getActorPos(actor) {
            return _actors.findIndex(a => a.actor.name === actor.name);
        }
        function getProductionPos(production) {
            return _productions.findIndex(p => p.title === production.title);
        }

        return {
            // Getter del nombre
            get name() { return _name; },
            set name(val) { _name = val; },

            // --- GESTIÓN DE CATEGORÍAS ---
            addCategory: function (category) {
                if (!(category instanceof Category)) throw new InvalidValueException("category", category);
                if (getCategoryPos(category) !== -1) throw new ElementExistsException(category.name);
                
                _categories.push({ category: category, productions: [] });
                return _categories.length;
            },

            removeCategory: function (category) {
                let index = getCategoryPos(category);
                if (index === -1) throw new ResourceNotFoundException(category.name);
                _categories.splice(index, 1);
                return _categories.length;
            },

            get categories() {
                // Iterador Generador
                let nextIndex = 0;
                return {
                    next: function () {
                        return nextIndex < _categories.length ?
                            { value: _categories[nextIndex++].category, done: false } :
                            { done: true };
                    }
                };
            },

            // --- GESTIÓN DE USUARIOS ---
            addUser: function (user) {
                if (!(user instanceof User)) throw new InvalidValueException("user", user);
                if (_users.find(u => u.username === user.username || u.email === user.email)) {
                    throw new ElementExistsException(user.username);
                }
                _users.push(user);
                return _users.length;
            },
            
            removeUser: function (user) {
                let index = _users.findIndex(u => u.username === user.username);
                if (index === -1) throw new ResourceNotFoundException(user.username);
                _users.splice(index, 1);
                return _users.length;
            },

            get users() {
                let nextIndex = 0;
                return {
                    next: function () {
                        return nextIndex < _users.length ?
                            { value: _users[nextIndex++], done: false } :
                            { done: true };
                    }
                };
            },

            // --- GESTIÓN DE PRODUCCIONES ---
            addProduction: function (production) {
                if (!(production instanceof Production)) throw new InvalidValueException("production", production);
                if (getProductionPos(production) !== -1) throw new ElementExistsException(production.title);
                _productions.push(production);
                return _productions.length;
            },

            removeProduction: function (production) {
                let index = getProductionPos(production);
                if (index === -1) throw new ResourceNotFoundException(production.title);
                
                // Borrar producción de la lista general
                _productions.splice(index, 1);

                // Borrar producción de las categorías, directores y actores
                [_categories, _directors, _actors].forEach(collection => {
                    collection.forEach(item => {
                        let pIndex = item.productions.indexOf(production);
                        if (pIndex !== -1) item.productions.splice(pIndex, 1);
                    });
                });
                return _productions.length;
            },

            get productions() {
                let nextIndex = 0;
                return {
                    next: function () {
                        return nextIndex < _productions.length ?
                            { value: _productions[nextIndex++], done: false } :
                            { done: true };
                    }
                };
            },

            // --- GESTIÓN DE ACTORES Y DIRECTORES ---
            addActor: function (actor) {
                if (!(actor instanceof Person)) throw new InvalidValueException("actor", actor);
                if (getActorPos(actor) !== -1) throw new ElementExistsException(actor.name);
                _actors.push({ actor: actor, productions: [] });
                return _actors.length;
            },
            removeActor: function (actor) {
                let index = getActorPos(actor);
                if (index === -1) throw new ResourceNotFoundException(actor.name);
                _actors.splice(index, 1);
                return _actors.length;
            },
            get actors() {
                let nextIndex = 0;
                return {
                    next: function () {
                        return nextIndex < _actors.length ?
                            { value: _actors[nextIndex++].actor, done: false } :
                            { done: true };
                    }
                };
            },

            addDirector: function (director) {
                if (!(director instanceof Person)) throw new InvalidValueException("director", director);
                if (getDirectorPos(director) !== -1) throw new ElementExistsException(director.name);
                _directors.push({ director: director, productions: [] });
                return _directors.length;
            },
            removeDirector: function (director) {
                let index = getDirectorPos(director);
                if (index === -1) throw new ResourceNotFoundException(director.name);
                _directors.splice(index, 1);
                return _directors.length;
            },
            get directors() {
                let nextIndex = 0;
                return {
                    next: function () {
                        return nextIndex < _directors.length ?
                            { value: _directors[nextIndex++].director, done: false } :
                            { done: true };
                    }
                };
            },

            // --- ASIGNACIONES (Category, Director, Actor) ---
            assignCategory: function (category, production) {
                if (getProductionPos(production) === -1) this.addProduction(production);
                let catIndex = getCategoryPos(category);
                if (catIndex === -1) { // Flyweight implícito: si no existe se añade
                    this.addCategory(category);
                    catIndex = getCategoryPos(category);
                }
                
                let catObj = _categories[catIndex];
                if (catObj.productions.indexOf(production) === -1) {
                    catObj.productions.push(production);
                }
                return catObj.productions.length;
            },
            deassignCategory: function (category, production) {
                let catIndex = getCategoryPos(category);
                if (catIndex === -1) throw new ResourceNotFoundException(category.name);
                let pIndex = _categories[catIndex].productions.indexOf(production);
                if (pIndex !== -1) _categories[catIndex].productions.splice(pIndex, 1);
                return _categories[catIndex].productions.length;
            },

            assignDirector: function (director, production) {
                if (getProductionPos(production) === -1) this.addProduction(production);
                let dirIndex = getDirectorPos(director);
                if (dirIndex === -1) {
                    this.addDirector(director);
                    dirIndex = getDirectorPos(director);
                }
                let dirObj = _directors[dirIndex];
                if (dirObj.productions.indexOf(production) === -1) {
                    dirObj.productions.push(production);
                }
                return dirObj.productions.length;
            },
            deassignDirector: function (director, production) {
                let dirIndex = getDirectorPos(director);
                if (dirIndex === -1) throw new ResourceNotFoundException(director.name);
                let pIndex = _directors[dirIndex].productions.indexOf(production);
                if (pIndex !== -1) _directors[dirIndex].productions.splice(pIndex, 1);
                return _directors[dirIndex].productions.length;
            },

            assignActor: function (actor, production) {
                if (getProductionPos(production) === -1) this.addProduction(production);
                let actIndex = getActorPos(actor);
                if (actIndex === -1) {
                    this.addActor(actor);
                    actIndex = getActorPos(actor);
                }
                let actObj = _actors[actIndex];
                if (actObj.productions.indexOf(production) === -1) {
                    actObj.productions.push(production);
                }
                return actObj.productions.length;
            },
            deassignActor: function (actor, production) {
                let actIndex = getActorPos(actor);
                if (actIndex === -1) throw new ResourceNotFoundException(actor.name);
                let pIndex = _actors[actIndex].productions.indexOf(production);
                if (pIndex !== -1) _actors[actIndex].productions.splice(pIndex, 1);
                return _actors[actIndex].productions.length;
            },

            // --- BÚSQUEDAS (Getters con Iteradores) ---
            getCast: function (production) {
                // Buscar actores que tengan esta producción
                let cast = _actors.filter(a => a.productions.includes(production)).map(a => a.actor);
                let nextIndex = 0;
                return {
                    next: function () {
                        return nextIndex < cast.length ? { value: cast[nextIndex++], done: false } : { done: true };
                    }
                };
            },

            getProductionsDirector: function (director) {
                let dirIndex = getDirectorPos(director);
                let prods = dirIndex !== -1 ? _directors[dirIndex].productions : [];
                let nextIndex = 0;
                return {
                    next: function () {
                        return nextIndex < prods.length ? { value: prods[nextIndex++], done: false } : { done: true };
                    }
                };
            },

            getProductionsActor: function (actor) {
                let actIndex = getActorPos(actor);
                let prods = actIndex !== -1 ? _actors[actIndex].productions : [];
                let nextIndex = 0;
                return {
                    next: function () {
                        return nextIndex < prods.length ? { value: prods[nextIndex++], done: false } : { done: true };
                    }
                };
            },

            getProductionsCategory: function (category) {
                let catIndex = getCategoryPos(category);
                let prods = catIndex !== -1 ? _categories[catIndex].productions : [];
                let nextIndex = 0;
                return {
                    next: function () {
                        return nextIndex < prods.length ? { value: prods[nextIndex++], done: false } : { done: true };
                    }
                };
            },
        };
    }

    return {
        getInstance: function (name) {
            if (!instantiated) {
                instantiated = init(name);
            }
            return instantiated;
        }
    };
})();