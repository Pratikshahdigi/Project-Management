import 'package:flutter/material';
import 'package:lucide_icons/lucide_icons.dart';

class TasksScreen extends StatelessWidget {
  const TasksScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> tasksMock = [
      {'title': 'Design Hero Banner Graphic', 'assignee': 'Liam Design', 'priority': 'High', 'status': 'Todo'},
      {'title': 'Optimize Google Ads Campaign', 'assignee': 'Olivia Manager', 'priority': 'Urgent', 'status': 'In Progress'},
      {'title': 'SEO Keyword Re-anchoring', 'assignee': 'Olivia Manager', 'priority': 'Low', 'status': 'Completed'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Production Tasks'),
        backgroundColor: const Color(0xFF09090C),
      ),
      body: ListView.builder(
        itemCount: tasksMock.length,
        itemBuilder: (context, idx) {
          final t = tasksMock[idx];
          return Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: const Color(0xFF18181F),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: const BorderSide(color: Colors.white10),
            ),
            child: ListTile(
              leading: Icon(
                t['status'] == 'Completed' ? LucideIcons.checkCircle2 : LucideIcons.clock,
                color: t['status'] == 'Completed' ? const Color(0xFF10B981) : Colors.amber,
              ),
              title: Text(t['title'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              subtitle: Text('Assignee: ${t['assignee']} | Priority: ${t['priority']}', style: const TextStyle(fontSize: 11, color: Colors.white54)),
              trailing: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, py: 4),
                decoration: BoxDecoration(
                  color: Colors.white12,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(t['status'], style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
              ),
            ),
          );
        },
      ),
    );
  }
}
