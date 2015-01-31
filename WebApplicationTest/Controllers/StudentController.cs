using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApplicationTest.Filters;
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
        public Student Get(int id)
        {
            var list = Students.List();

            return list.Where(s => s.UniqueId == id).FirstOrDefault();
        }

        // POST: api/Student
        [ValidateModel]
        [ResponseType(typeof(Student))]
        public IHttpActionResult Post([FromBody]Student value)
        {
            var list = Students.List();
            var nextId = 1;

            if (list.Any())
            {
                nextId = list.Max(s => s.UniqueId) + 1;
            }
            value.UniqueId = nextId;

            Students.Add(value);

            return CreatedAtRoute("DefaultApi", new { id = value.UniqueId }, value);
        }

        // PUT: api/Student/5
        [HttpPut]
        [ValidateModel]
        public HttpResponseMessage Put(int id, [FromBody]Student updatedStudent)
        {
            if (!Students.Update(id, updatedStudent)) {
                return this.Request.CreateResponse(HttpStatusCode.InternalServerError, "Coudn't update the student");
            }

            return this.Request.CreateResponse(HttpStatusCode.OK);
        }

        // DELETE: api/Student/5
        [HttpDelete]
        public void Delete(int id)
        {
           Students.Delete(id);
        }
    }
}
