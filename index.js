const { TodoistApi } = require('@doist/todoist-api-typescript');
require('dotenv').config(); // Optional: for environment variables
const fs = require('fs').promises;

async function getTodaysTasks() {
    const api = new TodoistApi(process.env.TODOIST_API_TOKEN || 'YOUR_API_TOKEN');

    try {
        const tasks = await api.getTasks();

        // Filter for today's tasks
        const today = new Date().toISOString().split('T')[0];

        // Separate today's and overdue tasks
        const { overdueItems, todayItems } = tasks.reduce((acc, task) => {
            if (task.due) {
                if (task.due.date === today) {
                    acc.todayItems.push(task);
                } else if (task.due.date < today) {
                    acc.overdueItems.push(task);
                }
            }
            return acc;
        }, { overdueItems: [], todayItems: [] });

        // Get all projects for reference
        const projects = await api.getProjects();
        const projectMap = projects.reduce((acc, project) => {
            acc[project.id] = project;
            return acc;
        }, {});

        // Generate markdown
        let markdown = "# Tasks\n\n";

        // Add overdue section if there are overdue tasks
        if (overdueItems.length > 0) {
            markdown += "## ⚠️ Overdue\n\n";
            overdueItems.forEach(task => {
                markdown += `- ${task.content}\n`;
            });
            markdown += '\n';
        }

        // Add today's tasks grouped by project
        markdown += "## Today\n\n";

        // Group today's tasks by project
        const tasksByProject = todayItems.reduce((acc, task) => {
            const projectId = task.projectId;
            if (!acc[projectId]) {
                acc[projectId] = {
                    name: projectMap[projectId].name,
                    tasks: []
                };
            }
            acc[projectId].tasks.push(task);
            return acc;
        }, {});

        Object.values(tasksByProject).forEach(project => {
            markdown += `### ${project.name}\n\n`;
            project.tasks.forEach(task => {
                markdown += `- ${task.content}\n`;
            });
            markdown += '\n';
        });

        return markdown;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function saveToMarkdown(content, filename = 'today_tasks.md') {
    try {
        await fs.writeFile(filename, content, 'utf8');
        console.log(`Tasks exported successfully to ${filename}!`);
    } catch (error) {
        console.error('Error saving file:', error);
        throw error;
    }
}

// Execute the script
async function main() {
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const filename = `tasks-${today}.md`;
        const markdown = await getTodaysTasks();
        await saveToMarkdown(markdown, filename);
    } catch (error) {
        console.error('Script failed:', error);
    }
}

main();
