﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApplicationTest.Models;

namespace WebApplicationTest.Controllers
{
    public class StudentController : ApiController
    {
        // GET: api/Student
        public IEnumerable<Student> Get()
        {
            return Students.List();
        }

        // GET: api/Student/5
        public Student Get(string id)
        {
            var list = Students.List();

            return list.Where(s => s.UniqueId == id).FirstOrDefault();
        }

        // POST: api/Student
        [ResponseType(typeof(Student))]
        public IHttpActionResult Post([FromBody]Student value)
        {
            var list = Students.List();
            var nextId = 1;

            if (list.Any())
            {
                nextId = Int32.Parse(list.Max(s => s.UniqueId)) + 1;
            }
            value.UniqueId = nextId.ToString();

            Students.Add(value);

            return CreatedAtRoute("DefaultApi", new { id = value.UniqueId }, value);
        }

        // PUT: api/Student/5
        public void Put(string id, [FromBody]Student value)
        {            
        }

        // DELETE: api/Student/5
        public void Delete(int id)
        {
        }
    }
}