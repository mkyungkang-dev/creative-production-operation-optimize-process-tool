-- Seed data for testing
-- Password for all users: password123 (hashed with SHA-256)
-- Hash: ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f

-- Insert admin user
INSERT OR IGNORE INTO users (id, email, password, name, role) VALUES 
  (1, 'admin@company.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Admin User', 'admin');

-- Insert production team members
INSERT OR IGNORE INTO users (id, email, password, name, role) VALUES 
  (2, 'production1@company.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'John Smith', 'production'),
  (3, 'production2@company.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Sarah Johnson', 'production');

-- Insert logistics team members
INSERT OR IGNORE INTO users (id, email, password, name, role) VALUES 
  (4, 'logistics1@company.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Mike Chen', 'logistics'),
  (5, 'logistics2@company.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Emily Davis', 'logistics');

-- Insert production tasks
INSERT OR IGNORE INTO tasks (id, name, description, team, status, assigned_to, expected_completion, priority, dependencies) VALUES 
  (1, 'Raw Material Procurement', 'Order raw materials from suppliers', 'production', 'completed', 2, '2025-11-08', 9, '[]'),
  (2, 'Quality Check - Raw Materials', 'Inspect incoming raw materials', 'production', 'completed', 3, '2025-11-09', 8, '[1]'),
  (3, 'Manufacturing Process', 'Begin manufacturing of product line A', 'production', 'in_progress', 2, '2025-11-15', 10, '[2]'),
  (4, 'Quality Control - Final Product', 'Final quality inspection', 'production', 'pending', 3, '2025-11-16', 9, '[3]'),
  (5, 'Packaging', 'Package finished products', 'production', 'pending', 2, '2025-11-17', 7, '[4]');

-- Insert logistics tasks
INSERT OR IGNORE INTO tasks (id, name, description, team, status, assigned_to, expected_completion, priority, dependencies) VALUES 
  (6, 'Warehouse Preparation', 'Prepare warehouse space for incoming products', 'logistics', 'in_progress', 4, '2025-11-17', 8, '[5]'),
  (7, 'Inventory Update', 'Update inventory management system', 'logistics', 'pending', 5, '2025-11-18', 6, '[6]'),
  (8, 'Shipping Coordination', 'Coordinate with shipping partners', 'logistics', 'pending', 4, '2025-11-19', 9, '[7]'),
  (9, 'Customer Delivery', 'Deliver products to customers', 'logistics', 'pending', 5, '2025-11-20', 10, '[8]'),
  (10, 'Delivery Confirmation', 'Confirm successful delivery', 'logistics', 'pending', 4, '2025-11-21', 7, '[9]');

-- Insert sample comments
INSERT OR IGNORE INTO comments (task_id, user_id, content) VALUES 
  (1, 2, 'Materials ordered from Supplier A. ETA: 3 days.'),
  (2, 3, 'Quality check passed. All materials meet specifications.'),
  (3, 2, 'Manufacturing started. Currently at 40% completion.');

-- Insert sample notifications
INSERT OR IGNORE INTO notifications (user_id, task_id, message, type, is_read) VALUES 
  (2, 3, 'Task "Manufacturing Process" is now in progress', 'task_update', 1),
  (3, 4, 'Task "Quality Control - Final Product" deadline is approaching', 'deadline_warning', 0),
  (4, 6, 'You have been assigned to "Warehouse Preparation"', 'assignment', 0);
