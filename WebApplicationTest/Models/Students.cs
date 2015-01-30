using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc.Html;

namespace WebApplicationTest.Models
{
    public class Students
    {
        private static List<Student> _students;

        public Students()
        {
            if (_students == null)
            {
                _students = new List<Student>
                            {
                                new Student
                                {
                                    UniqueId = 1,
                                    Name = "John",
                                    Surname = "Smith",
                                    BirthDate = DateTime.Parse("01/01/1975")
                                }
                            };
            }
        }

        public static List<Student> List()
        {
            return _students;
        }

        public static void Add(Student newstudent)
        {
            if (_students != null)
            {
                // Create UniqueId
                var lastStudent = _students.LastOrDefault();

                if (lastStudent != null)
                {                    
                    int uniqueId = lastStudent.UniqueId;
                    newstudent.UniqueId = uniqueId + 1;
                    
                }
                
                _students.Add(newstudent);
            }
        }

        public static bool Update(int id, Student updatedStudent)
        {
            bool isUpdatePerformed = false;

            if (_students != null &&
                _students.Any(x => x.UniqueId == id))
            {
                var studentToUpdate = _students.SingleOrDefault(x => x.UniqueId == updatedStudent.UniqueId);

                if (studentToUpdate != null)
                {
                    studentToUpdate.Name = updatedStudent.Name;
                    studentToUpdate.Surname = updatedStudent.Surname;
                    studentToUpdate.BirthDate = updatedStudent.BirthDate;

                    isUpdatePerformed = true;
                }
            }

            return isUpdatePerformed;
        }
        
        public static void Delete(int idStudentToDelete)
        {
            if (_students != null)
            {
                var studentToDelete = _students.SingleOrDefault(x => x.UniqueId == idStudentToDelete);

                if (studentToDelete != null) 
                {
                    _students.Remove(studentToDelete);
                }
            }
        }

    }
}