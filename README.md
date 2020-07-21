# API REST Soy Nutri

## Las rutas disponibles en la API, con sus respectivos campos, son las siguientes:

### 1. https://us-central1-back-f0378.cloudfunctions.net/api/adminAuth/signup
#### Tipo de petición:
POST
#### Restricciones: 
Solo puede existir un administrador, al ingresarlo se bloquea la creación de otro.
#### Campos necesatrios:
- rut 
- password
#### Formato de envio
- JSON

### 2. https://us-central1-back-f0378.cloudfunctions.net/api/adminAuth/login
#### Tipo de petición:
POST
#### Restricciones: 
NA.
#### Campos necesatrios:
- rut 
- password
#### Formato de envio
- JSON

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
#### Formato de envio
- JSON

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
#### Formato de envio
- JSON

### 5. https://us-central1-back-f0378.cloudfunctions.net/api/patientsAuth/login
#### Tipo de petición:
POST
#### Restricciones: 
NA.
#### Campos necesatrios:
- rut 
- password
#### Formato de envio
- JSON

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
#### Formato de envio
- JSON
