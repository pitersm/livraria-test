using LivrariaTest.DAL.Models;
using LivrariaTest.DAL.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace LivrariaTest.DAL
{
    public class BaseRepository<TEntity> : IRepository<TEntity> where TEntity : class, BaseModel
    {
        private readonly DataContext _context;
        private DbSet<TEntity> entities;

        public BaseRepository(DataContext context)
        {
            _context = context;
            entities = context.Set<TEntity>();
        }

        public Task<TEntity> Get(string id)
        {
            return entities.Where(a => a.Id.ToString() == id).FirstOrDefaultAsync();
        }

        public IQueryable<TEntity> List()
        {
            return entities.Select(a => a);
        }

        public async Task<TEntity> Save(TEntity entity) {
            await entities.AddAsync(entity);
            await _context.SaveChangesAsync();

            return entity;
        }

        public async Task Update(TEntity entity) {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            entities.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(string id)
        {
            TEntity entity = await Get(id);
            entities.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
