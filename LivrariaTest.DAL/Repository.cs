using LivrariaTest.DAL.Models;
using LivrariaTest.DAL.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LivrariaTest.DAL
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class, BaseModel
    {
        private readonly DataContext _context;

        public Repository(DataContext context)
        {
            _context = context;
        }

        public Task<TEntity> Get(string id)
        {
            return _context.Set<TEntity>().Where(a => a.Id.ToString() == id).FirstOrDefaultAsync();
        }

        public IQueryable<TEntity> List()
        {
            return _context.Set<TEntity>().Select(a => a);
        }
    }
}
