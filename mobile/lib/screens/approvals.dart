import 'package:flutter/material';
import 'package:lucide_icons/lucide_icons.dart';

class ApprovalsScreen extends StatefulWidget {
  const ApprovalsScreen({super.key});

  @override
  State<ApprovalsScreen> createState() => _ApprovalsScreenState();
}

class _ApprovalsScreenState extends State<ApprovalsScreen> {
  final List<Map<String, dynamic>> postsMock = [
    {
      'id': 'post-2',
      'content': 'Weekly round-up of marketing tips. Add emojis to increase interaction!',
      'platforms': 'Instagram, LinkedIn',
      'status': 'Pending Approval',
    }
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Campaign approvals queue'),
        backgroundColor: const Color(0xFF09090C),
      ),
      body: postsMock.isEmpty
          ? const Center(child: Text('No pending campaign post approval logs.', style: TextStyle(color: Colors.white54)))
          : ListView.builder(
              itemCount: postsMock.length,
              itemBuilder: (context, idx) {
                final p = postsMock[idx];
                return Card(
                  margin: const EdgeInsets.all(16),
                  color: const Color(0xFF18181F),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: const BorderSide(color: Colors.white10),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            Text(p['platforms'], style: const TextStyle(fontSize: 10, color: Color(0xFF8B5CF6), fontWeight: FontWeight.bold)),
                            const Icon(LucideIcons.clock, size: 14, color: Colors.amber),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(p['content'], style: const TextStyle(fontSize: 13, height: 1.4)),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF10B981),
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                ),
                                onPressed: () {
                                  setState(() {
                                    postsMock.removeAt(idx);
                                  });
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Campaign schedule approved for publishing.')),
                                  );
                                },
                                child: const Text('Approve', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: OutlinedButton(
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: Colors.redAccent,
                                  side: const BorderSide(color: Colors.redAccent),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                ),
                                onPressed: () {
                                  setState(() {
                                    postsMock.removeAt(idx);
                                  });
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Draft returned to designer for edits.')),
                                  );
                                },
                                child: const Text('Reject', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
