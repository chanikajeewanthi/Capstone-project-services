module.exports = {
  apps : [
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
