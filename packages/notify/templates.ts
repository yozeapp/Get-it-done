export function reminderEmailTemplate(data: { taskTitle: string; dueAt?: string; manageUrl: string; unsubscribeUrl: string; }) {
  return {
    subject: `Reminder: ${data.taskTitle}`,
    html: `<h2>${data.taskTitle}</h2>
           ${data.dueAt ? `<p>Due: ${data.dueAt}</p>` : ''}
           <p><a href="${data.manageUrl}">View Task</a></p>
           <hr/><p><a href="${data.unsubscribeUrl}">Unsubscribe</a></p>`
  };
}

export function reminderSmsText(taskTitle: string) {
  return `Reminder: ${taskTitle} — Manage: ${process.env.APP_BASE_URL}/tasks`;
}
