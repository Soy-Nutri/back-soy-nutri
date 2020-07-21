# API REST Soy Nutri

## Las rutas disponibles en la API, con sus respectivos campos y restricciones, son las siguientes:

### 1. https://us-central1-back-f0378.cloudfunctions.net/api/adminAuth/signup
#### Tipo de petición:
POST
#### Restricciones: 
Solo puede existir un administrador, al ingresarlo se bloquea la creación de otro.
#### Campos necesatrios:
- rut 
- password
#### Formato de envio:
- JSON
#### Respuesta:
- Token

### 2. https://us-central1-back-f0378.cloudfunctions.net/api/adminAuth/login
#### Tipo de petición:
POST
#### Restricciones: 
NA.
#### Campos necesatrios:
- rut 
- password
#### Formato de envio:
- JSON
#### Respuesta:
- Token
- rut

### 3. https://us-central1-back-f0378.cloudfunctions.net/api/adminAuth/changePassword
#### Tipo de petición:
POST
#### Restricciones: 
Se debe enviar un header con la siguiente información:
- key: Authorization
- value: Bearer + Token inicio de sesión del administrador
#### Campos necesatrios:
- rut 
- password
- newPassword
#### Formato de envio:
- JSON
#### Respuesta:
- Mensaje
- Token

### 4. https://us-central1-back-f0378.cloudfunctions.net/api/patientsAuth/signup
#### Tipo de petición:
POST
#### Restricciones: 
Se debe enviar un header con la siguiente información:
- key: Authorization
- value: Bearer + Token inicio de sesión del administrador
#### Campos necesatrios:
- rut
- names
- father_last_name
- mother_last_name
- city
- email
- phone
- birth_date
- sex
- alimentation
#### Formato de envio:
- JSON
#### Respuesta:
- Token

### 5. https://us-central1-back-f0378.cloudfunctions.net/api/patientsAuth/login
#### Tipo de petición:
POST
#### Restricciones: 
NA.
#### Campos necesatrios:
- rut 
- password
#### Formato de envio:
- JSON
#### Respuesta:
- Token
- rut
- names
- father_last_name
- mother_last_name
- city
- email
- phone
- birth_date
- sex
- alimentation
- in_date
- state

### 6. https://us-central1-back-f0378.cloudfunctions.net/api/patientsAuth/changePassword
#### Tipo de petición:
POST
#### Restricciones: 
Se debe enviar un header con la siguiente información:
- key: Authorization
- value: Bearer + Token inicio de sesión del paciente
#### Campos necesatrios:
- rut 
- password
- newPassword
#### Formato de envio:
- JSON
#### Respuesta:
- Mensaje
- Token

### 7. https://us-central1-back-f0378.cloudfunctions.net/api/patientsCarnet/addControl
#### Tipo de petición:
POST
#### Restricciones: 
Se debe enviar un header con la siguiente información:
- key: Authorization
- value: Bearer + Token inicio de sesión del administrador
#### Campos necesatrios:
- rut 
- date
- weight
- size
- cbr
- cbc
- cc_min
- cc_max
- cad_max
- triceps_fold
- subscapular_fold
- abdominal_fold
- imc
- dni
- biological_age
- visceral_fat
- fat
- mass
- muscle_mass
#### Formato de envio:
- JSON
#### Respuesta:
- Mensaje

### 8. https://us-central1-back-f0378.cloudfunctions.net/api/patientsCarnet/getCarnet/:user/:rut
#### Tipo de petición:
GET
#### Parámetros
- user: admin o patient, dependiendo del token a ingresar
- rut: rut del usuario a consultar
#### Restricciones: 
Se debe enviar un header con la siguiente información:
- key: Authorization
- value: Bearer + Token inicio de sesión del administrador o Paciente
#### Campos necesatrios:
NA.
#### Formato de envio:
- JSON
#### Respuesta:
- Carnet

### 9. https://us-central1-back-f0378.cloudfunctions.net/api/patientsCarnet/getCarnet/:user/:rut/:date
#### Tipo de petición:
GET
#### Parámetros
- user: admin o patient, dependiendo del token a ingresar
- rut: rut del usuario a consultar
- date: fecha del control a consultar, formato YYYY-MM-DD
#### Restricciones: 
Se debe enviar un header con la siguiente información:
- key: Authorization
- value: Bearer + Token inicio de sesión del administrador o Paciente
#### Campos necesatrios:
NA.
#### Formato de envio:
- JSON
#### Respuesta:
- Control de la fecha seleccionada

### 10. Modify Control

### 11. Delete one control

### 12. Delete all control
