using Microsoft.AspNetCore.Mvc;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    // In-memory list (no database needed for beginners)
    private static List<TodoItem> _todos = new()
    {
        new TodoItem { Id = 1, Title = "Learn React", IsCompleted = false },
        new TodoItem { Id = 2, Title = "Learn .NET", IsCompleted = false },
        new TodoItem { Id = 3, Title = "Build Full Stack App", IsCompleted = false }
    };

    private static int _nextId = 4;

    // GET: api/todos — Get all todos
    [HttpGet]
    public ActionResult<IEnumerable<TodoItem>> GetAll()
    {
        return Ok(_todos);
    }

    // GET: api/todos/1 — Get a single todo by ID
    [HttpGet("{id}")]
    public ActionResult<TodoItem> GetById(int id)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo == null)
            return NotFound();

        return Ok(todo);
    }

    // POST: api/todos — Create a new todo
    [HttpPost]
    public ActionResult<TodoItem> Create([FromBody] TodoItem newTodo)
    {
        newTodo.Id = _nextId++;
        newTodo.IsCompleted = false;
        _todos.Add(newTodo);
        return CreatedAtAction(nameof(GetById), new { id = newTodo.Id }, newTodo);
    }

    // PUT: api/todos/1 — Update an existing todo
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] TodoItem updatedTodo)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo == null)
            return NotFound();

        todo.Title = updatedTodo.Title;
        todo.IsCompleted = updatedTodo.IsCompleted;

        return NoContent();
    }

    // DELETE: api/todos/1 — Delete a todo
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo == null)
            return NotFound();

        _todos.Remove(todo);
        return NoContent();
    }
}
