import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import { useMochiStore } from "../store/useMochiStore";

export default function TasksPage() {
  const [title, setTitle] = useState("");
  const tasks = useMochiStore((state) => state.tasks);
  const addTask = useMochiStore((state) => state.addTask);
  const toggleTask = useMochiStore((state) => state.toggleTask);

  function submitTask() {
    addTask(title);
    setTitle("");
  }

  return (
    <section className="grid gap-4">
      <header className="rounded-[28px] bg-gradient-to-br from-[#d8cbff] to-[#ffe3ec] p-5 shadow-xl">
        <p className="text-xs font-black uppercase tracking-wide text-[#8b6bc0]">Tasks</p>
        <h2 className="mt-1 text-3xl font-black">Mochi keeps it gentle.</h2>
      </header>

      <section className="grid gap-3 rounded-[28px] border border-white/30 bg-white/80 p-4 shadow-xl">
        <input
          className="h-12 rounded-2xl border border-[#f1c9d5] px-4 text-base font-bold outline-none"
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submitTask();
          }}
          placeholder="Add a tiny care task"
          value={title}
        />
        <button className="h-12 rounded-2xl bg-[#49343a] font-black text-white" onClick={submitTask}>
          Add Task
        </button>
      </section>

      <section className="grid gap-3">
        {tasks.length === 0 ? (
          <EmptyState text="No tasks yet. Mochi suggests one small thing, not ten." />
        ) : (
          tasks.map((task) => (
            <button
              className="grid grid-cols-[44px_1fr] items-center gap-3 rounded-[24px] border border-white/30 bg-white/80 p-3 text-left shadow-lg"
              key={task.id}
              onClick={() => toggleTask(task.id)}
              type="button"
            >
              <span className={`grid h-11 w-11 place-items-center rounded-2xl ${task.completed ? "bg-[#8bc7a5] text-white" : "bg-[#fff1cf] text-[#b26d83]"}`}>
                {task.completed ? <FiCheck /> : ""}
              </span>
              <span className={task.completed ? "font-black text-[#8a7774] line-through" : "font-black"}>{task.title}</span>
            </button>
          ))
        )}
      </section>
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-[24px] bg-white/70 p-4 text-center text-sm font-bold text-[#7c6460] shadow-lg">{text}</p>;
}
