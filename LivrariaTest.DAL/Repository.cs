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

        public Task<TEntity> Create(TEntity entity) {
            await _context.Set<TEntity>.AddAsync(entity);
            await _context.SaveChangesAsync();

            return entity;
        }

        public Task Update(TEntity entity) {
            _context.Entry(entity).State = System.Data.EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}
