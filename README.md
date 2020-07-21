# API REST Soy Nutri

## Las rutas disponibles en la API, con sus respectivos campos y restricciones, son las siguientes:

### 1. https://us-central1-back-f0378.cloudfunctions.net/api/adminAuth/signup
#### Tipo de petición:
POST
#### Restricciones: 
Solo puede existir un administrador, al ingresarlo se bloquea la creación de otro.
#### Campos necesarios:
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
#### Campos necesarios:
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
#### Campos necesarios:
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
#### Campos necesarios:
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
#### Campos necesarios:
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
#### Campos necesarios:
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
#### Campos necesarios:
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
#### Campos necesarios:
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
#### Campos necesarios:
NA.
#### Formato de envio:
- JSON
#### Respuesta:
- Control de la fecha seleccionada

### 10. Modify Control

### 11. Delete one control

### 12. Delete all control

### 13. 

### 14.

### 15. 

### 16.

### 17.

### 18.

### 19. Add a daily diet.
- Url: https://us-central1-back-f0378.cloudfunctions.net/api/patientsDailyDiets/addDailyDiet
- Tipo de petición: POST
- Restricciones: 
    - key: Authorization
    - value: Bearer + Token inicio de sesión del administrador
- Campos necesarios:
    - rut
    - date
    - breakfast_time
    - breakfast
    - lunch_time
    - lunch
    - snack_time
    - snack
    - post_training
    - dinner_time
    - dinner
    - calories
    - proteins
    - goals
    - extra_info
- Respuesta: estado (status code) y mensaje
