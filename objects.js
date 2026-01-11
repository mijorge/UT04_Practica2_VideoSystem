/*
 * UT04 Práctica 2: Objetos del VideoSystem
 * Descripción: Definición de Entidades y Excepciones.
 */

// --- EXCEPCIONES PERSONALIZADAS ---
class BaseException extends Error {
    constructor(message = "", fileName, lineNumber) {
        super(message, fileName, lineNumber);
        this.name = "BaseException";
        if (Error.captureStackTrace) Error.captureStackTrace(this, BaseException);
    }
}

class InvalidAccessConstructorException extends BaseException {
    constructor(fileName, lineNumber) {
        super("El constructor no puede ser llamado directamente.", fileName, lineNumber);
        this.name = "InvalidAccessConstructorException";
    }
}

class InvalidValueException extends BaseException {
    constructor(param, value, fileName, lineNumber) {
        super(`El parámetro ${param} tiene un valor inválido: ${value}`, fileName, lineNumber);
        this.name = "InvalidValueException";
    }
}

class ResourceNotFoundException extends BaseException {
    constructor(resource, fileName, lineNumber) {
        super(`El recurso ${resource} no existe.`, fileName, lineNumber);
        this.name = "ResourceNotFoundException";
    }
}

class ElementExistsException extends BaseException {
    constructor(elem, fileName, lineNumber) {
        super(`El elemento ${elem} ya existe.`, fileName, lineNumber);
        this.name = "ElementExistsException";
    }
}

// --- ENTIDADES ---

class Person {
    constructor(name, lastname, born, picture) {
        if (!name || !lastname) throw new InvalidValueException("name/lastname", "vacío");
        this.name = name;
        this.lastname = lastname;
        this.born = born; // Date object
        this.picture = picture;
    }
    toString() {
        return `${this.name} ${this.lastname}`;
    }
}

class Category {
    constructor(name, description = "") {
        if (!name) throw new InvalidValueException("name", "vacío");
        this.name = name;
        this.description = description;
    }
    toString() {
        return this.name;
    }
}

class Resource {
    constructor(duration, link) {
        this.duration = duration; // min
        this.link = link;
    }
    toString() {
        return `${this.link} (${this.duration} min)`;
    }
}

class Coordinate {
    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    toString() {
        return `Lat: ${this.latitude}, Lon: ${this.longitude}`;
    }
}

class User {
    constructor(username, email, password) {
        if (!username || !email || !password) throw new InvalidValueException("user data", "incompleto");
        this.username = username;
        this.email = email;
        this.password = password;
    }
    toString() {
        return this.username;
    }
}

// --- JERARQUÍA DE PRODUCCIONES ---

// Clase Abstracta Production
class Production {
    constructor(title, nationality, publication, synopsis, image) {
        // Truco para simular clase abstracta (no se puede hacer new Production)
        if (new.target === Production) {
            throw new InvalidAccessConstructorException();
        }
        if (!title) throw new InvalidValueException("title", "vacío");
        
        this.title = title;
        this.nationality = nationality;
        this.publication = publication; // Date
        this.synopsis = synopsis;
        this.image = image;
    }
    
    toString() {
        return `${this.title} (${this.nationality})`;
    }
}

class Movie extends Production {
    constructor(title, nationality, publication, synopsis, image, resource, locations = []) {
        super(title, nationality, publication, synopsis, image);
        this.resource = resource; // Objeto Resource
        this.locations = locations; // Array de Coordinate
    }
    toString() {
        return `[Película] ${super.toString()}`;
    }
}

class Serie extends Production {
    constructor(title, nationality, publication, synopsis, image, resources = [], seasons = []) {
        super(title, nationality, publication, synopsis, image);
        this.resources = resources; // Array de Resource
        this.seasons = seasons; // Array de Seasons (opcional según PDF, usaremos números o strings)
    }
    toString() {
        return `[Serie] ${super.toString()}`;
    }
}