using LivrariaTest.DAL.Data;
using LivrariaTest.DAL.Models;
using LivrariaTest.DAL.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LivrariaTest.DAL
{
    public class BookRepository : BaseRepository<Book>, IBookRepository
    {
        private readonly DataContext _context;

        public BookRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<bool> ISBNExists(long isbn)
        {
            var obj = await List().FirstOrDefaultAsync(a => a.ISBN == isbn);
            return obj != null;
        }
    }
}
