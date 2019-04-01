using LivrariaTest.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LivrariaTest.DAL
{
    public interface IRepository<TEntity> where TEntity : class, BaseModel
    {
        IQueryable<TEntity> List();
        Task<TEntity> Get(string id);
        Task<TEntity> Post(TEntity entity);
    }
}
