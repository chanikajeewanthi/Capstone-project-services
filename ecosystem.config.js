module.exports = {
  apps : [
      {
          name: "cloud-sql-auth-proxy",
          script: "./cloud-sql-proxy ijse-cloud-storage:asia-southeast1:mysql-vm ijse-cloud-storage:asia-southeast1:postgres-vm --private-ip",
          log_file: "./logs/cloud-sql-proxy.log",
      },
      {
    name   : "student-service",
    script : "java -jar student-service/target/Student-Service-1.0.0.jar",
    log_file : "./logs/student_service.log",
    instances : 2
  },
      {
          name   : "program-service",
          script : "java -jar program-service/target/Program-Service-1.0.0.jar",
          log_file : "./logs/program_service.log",
          instances : 2
      },
      {
          name   : "enrollment-service",
          script : "java -jar enrollment-service/target/Enrollment-Service-1.0.0.jar",
          log_file : "./logs/enrollment_service.log",
          instances : 2
      }

  ]
}
