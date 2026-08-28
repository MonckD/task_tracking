import User from './User.js';
import Team from './Team.js';
import TeamMember from './TeamMember.js';
import Project from './Project.js';
import Task from './Task.js';
import TaskUpdate from './TaskUpdate.js';
import Message from './Message.js';
import Notification from './Notification.js';

Team.belongsToMany(User, { through: TeamMember, as: 'members', foreignKey: 'team_id' });
User.belongsToMany(Team, { through: TeamMember, as: 'teams', foreignKey: 'user_id' });

Team.hasMany(Project, { foreignKey: 'team_id' });
Project.belongsTo(Team, { foreignKey: 'team_id' });

Task.belongsTo(User, { as: 'assignee', foreignKey: 'assigned_to' });
Task.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
Task.belongsTo(Project, { foreignKey: 'project_id' });
Task.hasMany(TaskUpdate, { foreignKey: 'task_id' });

TaskUpdate.belongsTo(User, { foreignKey: 'user_id' });
TaskUpdate.belongsTo(Task, { foreignKey: 'task_id' });

Message.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' });
Message.belongsTo(Team, { foreignKey: 'team_id' });

Notification.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
Notification.belongsTo(Team, { foreignKey: 'team_id' });

export { User, Team, TeamMember, Project, Task, TaskUpdate, Message, Notification };
