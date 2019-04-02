using LivrariaTest.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LivrariaTest.DAL.Repository
{
    public interface IBookRepository : IRepository<Book>
    {
        Task<bool> ISBNExists(long isbn);
    }
}
