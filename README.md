![image](https://github.com/user-attachments/assets/dfd94dc0-7836-4b53-980f-028b128e3b18)# GIC-Test
 
1. Install Docker.
2. Clone the repository
3. At the root of the repo, run the docker-compose build.
4. After the build is completed, run docker-compose up. This will initialize the MySQL database, plus the backend and frontend applications.
5. You will need to restart the backend application. This is because it initialized much faster than the database and tends to connect to it while it is not up yet, and that causes it to throw an error. 
6. Once all three applications are started, navigate to http://localhost:4173 to check on the application
7. To run the test, create a .env file under the test folder. You can reference the key and value from the docker-compose file, but change the DB_USERNAME to root and the DB_NAME to test.
