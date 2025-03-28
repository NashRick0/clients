import Client from '../models/clientModel.js';
import { clientCreatedEvent } from '../services/rabbitServicesEvent.js';
import { sendUserCreatedEvent } from '../services/rabbitServicesEvent.js'; // Importar la función para enviar el evento

export const getClient = async (req, res) => {
    try {
        const client = await Client.findAll();
        res.status(200).json(client);
    } catch (error) {
        console.error('Error en la sistama de clientes: ', error);
        res.status(500).json({ message: 'Error al obtener los clientes' });
    }
};

export const createClient = async (req, res) => {
    const { name, last_name, email, phone, born_date, direction } = req.body;

    try {
        const newClient = await Client.create({
            name,
            last_name,
            email,
            phone,
            born_date,
            direction,
            status: true,
            creationDate: new Date(),
        });

        console.log(newClient);
        //Agregar la funcion
        try {
            await clientCreatedEvent(newClient);
        } catch (error) {
            console.log("Error al registrar el cliente");
        }

        // Crear usuario asociado al cliente
        const password = 'password123'; // Contraseña genérica
        const newUser = {
            username: email,
            phone,
            password
        };

        try {
            await sendUserCreatedEvent(newUser); // Enviar evento para crear el usuario
        } catch (error) {
            console.log("Error al crear el usuario");
        }

        return res.status(201).json({ message: "Cliente creado y usuario asociado", data: newClient });

    } catch (error) {
        console.error("Error al crear el cliente:", error);
        return res.status(500).json({ message: "Error al crear el cliente" });
    }
};

export const updateClient = async (req, res) => {
    const { id } = req.params;
    const { name, last_name, email, phone, direction } = req.body;

    const existingEmail = await Client.findOne({ where: { email } });
    if (existingEmail) {
        return res.status(400).json({ message: "El Correo ya está registrado, favor de cambiarlo" });
    }

    try {
        const client = await Client.findByPk(id);
        if (!client) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        await client.update({
            name: name || client.name,
            last_name: last_name || client.last_name,
            email: email || client.email,
            phone: phone || client.phone,
            direction: direction || client.direction,
        });

        return res.status(201).json({ message: "Cliente actualizado", data: client });
    } catch (error) {
        console.error("Error al actualizar el cliente:", error);
        return res.status(500).json({ message: "Error al actualizar el cliente" });
    }
};

export const deleteClient = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const client = await Client.findByPk(id);
        if (!client) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        await client.update({
            status: false,
        });

        return res.status(201).json({ message: "Cliente dado de baja", data: client });
    } catch (error) {
        console.error("Error al dar de baja al cliente:", error);
        return res.status(500).json({ message: "Error al dar de baja al cliente" });
    }
};
