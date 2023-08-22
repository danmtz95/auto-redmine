const axios = require('axios');
const fs = require('fs');
// URL de la API de Redmine para crear issues
const apiUrl = ""

const apiUrlget = ""
// Clave de API de Redmine
const apiKey = ""

// Ruta del archivo de texto con la lista de actividades
const filePath = './actividades.txt';



// Leer el archivo de texto
async function readFileAndCreateIssues() {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        // Procesar el contenido línea por línea
        const lines = data.split('\n');
        const objetoDesdeArchivo = {};

        lines.forEach((line, index) => {
            // Aquí puedes procesar cada línea según tu necesidad
            // Por ejemplo, si cada línea contiene un elemento separado por coma:
            // const elementos = line.split(',');
            // objetoDesdeArchivo[`elemento${index}`] = elementos;
            if (line.trim() !== '') {
                objetoDesdeArchivo[`linea${index}`] = line;
            }
        });

        // let startDate = new Date(Date.UTC(2023, 8, 14));
        let startDate = new Date('08-16-2023'); //cambiar la fecha de inicio de las actividades
        console.log('Date: ' + startDate);

        let dueDate = new Date('2023-08-21'); // cambiar la fecha estimada de fin de las actividades
        const nextWeekDay = new Date(startDate);
        const nextDueDate = new Date(dueDate);

        const issuesToCreate = []
        for (const key of Object.keys(objetoDesdeArchivo)) {
            const activity = objetoDesdeArchivo[key];


            if (nextWeekDay.getDay() === 6) { // Si es sábado (6), suma 2 días para llegar al lunes
                nextWeekDay.setDate(nextWeekDay.getDate() + 2);
            } else if (nextWeekDay.getDay() === 0) { // Si es domingo (0), suma 1 día para llegar al lunes
                nextWeekDay.setDate(nextWeekDay.getDate() + 1);
            }

            issuesToCreate.push(
                {
                    // "issue": {
                    "project_id": 283,
                    "tracker_id": 2,
                    "status_id": 1,
                    "priority_id": 2,
                    "author_id": 129,
                    "assigned_to_id": 129,
                    "subject": activity,
                    // "description": "Ajuste en actas y reportes para producción", // no description for this example
                    "start_date": nextWeekDay.toISOString().split('T')[0],
                    "due_date": nextWeekDay.toISOString().split('T')[0],
                    "done_ratio": 100,
                    "estimated_hours": 8,
                    //FOR SPENT TIME 
                    "spent_on": nextWeekDay.toISOString().split('T')[0],
                    "hours": 8.0,
                    "activity_id": 9,
                    //9 = development , 22 for bug
                    //END OF SPENT TIME
                    "custom_fields": [
                        {
                            "id": 2,
                            "value": "Web"
                        },
                        {
                            "id": 3,
                            "value": "1"
                        }
                    ]
                    // }
                });

            // Aumentar el contador de días
            nextWeekDay.setDate(nextWeekDay.getDate() + 1);

        }
        console.log('Objetos creados:', issuesToCreate);
        // console.log('Objeto creado:', objetoDesdeArchivo);
        //CICLO PARA REGISTRO DE LISTA DE ACTIVIDADES issuesToCreate
        for (const issueData of issuesToCreate) {
            const headers = {
                'Content-Type': 'application/json',
                'X-Redmine-API-Key': apiKey,
            };
            try {
                const response = await axios.post(apiUrl, { issue: issueData }, { headers });
                if (response.status === 201) {
                    console.log(`Issue creado: ${issueData.subject}`);
                } else {
                    console.log(`Error al crear issue: ${response.status}`);
                    console.log(response.data);
                }
            } catch (error) {
                console.error('Error al enviar solicitud:', error.message);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }

}

// Enviar solicitudes POST para crear los issues
async function createIssues() {
    //descomentar para insertar
    // for (const issueData of issuesToCreate) {
    //     const headers = {
    //         'Content-Type': 'application/json',
    //         'X-Redmine-API-Key': apiKey,
    //     };

    //     try {
    //         const response = await axios.post(apiUrl, { issue: issueData }, { headers });
    //         if (response.status === 201) {
    //             console.log(`Issue creado: ${issueData.subject}`);
    //         } else {
    //             console.log(`Error al crear issue: ${response.status}`);
    //             console.log(response.data);
    //         }
    //     } catch (error) {
    //         console.error('Error al enviar solicitud:', error.message);
    //     }
    // }
}

async function getIssuebyId(issue_id) {
    const headers = {
        'Content-Type': 'application/json',
        'X-Redmine-API-Key': apiKey,
    };
    try {
        const response = await axios.get(apiUrlget.replace('{issue_id}', issue_id), { headers });
        if (response.status === 200) {
            console.log('Issue obtenido:', JSON.stringify(response.data, null, 2));
        } else {
            console.log(`Error al obtener issue: ${response.status}`);
            console.log(response.data);
        }
    } catch (error) {
        console.error('Error al enviar solicitud:', error.message);
    }
}
const issueIdToGet = 29002;

// readFileAndCreateIssues(); // descomentar esta funcion para generar y registrar las actividades del archivo actividades.txt
// getIssuebyId(issueIdToGet);