![image](https://github.com/user-attachments/assets/dfd94dc0-7836-4b53-980f-028b128e3b18)# GIC-Test
 
1. Install Docker.
2. Clone the repository
3. At the root of the repo, run docker-compose build.
4. After the build is completed, run docker-compose up. This will initialize MySQL Database and the backend and frontend applications.
5. You will need to restart the backend application due to it will try to connect to the db while the db is still initializing.
6. Once all 3 applications are started, navigate to http://localhost:4173 to access the application
   
