import 'package:flutter/material';
import 'package:lucide_icons/lucide_icons.dart';

class MobileDashboard extends StatelessWidget {
  const MobileDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('CEO Command Center'),
        backgroundColor: const Color(0xFF09090C),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.bell),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('No new alerts. Meta posting queue normal.')),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome badge
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF18181F),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white12),
                ),
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Enterprise Core Active', style: TextStyle(color: Color(0xFF10B981), fontSize: 11, fontWeight: FontWeight.bold)),
                    SizedBox(height: 4),
                    Text('Alexander Vance', style: TextStyle(fontSize: 18, fontWeight: FontWeight.black)),
                    Text('Alexander.v@agency.local', style: TextStyle(color: Colors.white54, fontSize: 12)),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              const Text('Agency Core Metrics', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.1)),
              const SizedBox(height: 12),

              // Metrics Grid
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 1.4,
                children: [
                  _buildMetricCard('Monthly MRR', '\$35.5K', const Color(0xFF8B5CF6)),
                  _buildMetricCard('Annual ARR', '\$438K', const Color(0xFF10B981)),
                  _buildMetricCard('Active Clients', '3 Accounts', Colors.amber),
                  _buildMetricCard('Productivity', '92%', Colors.rose),
                ],
              ),
              const SizedBox(height: 24),

              // Quick Actions menu
              const Text('Quick Operations', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),

              ListTile(
                leading: const Icon(LucideIcons.kanbanSquare, color: Color(0xFF8B5CF6)),
                title: const Text('Tasks & Kanban boards'),
                subtitle: const Text('Track deliverables & assignee capacity'),
                trailing: const Icon(LucideIcons.arrowRight, size: 16),
                onTap: () => Navigator.pushNamed(context, '/tasks'),
              ),
              const Divider(color: Colors.white12),
              ListTile(
                leading: const Icon(LucideIcons.checkSquare, color: Color(0xFF10B981)),
                title: const Text('Social Approvals queue'),
                subtitle: const Text('Designer pipeline approvals logs'),
                trailing: const Icon(LucideIcons.arrowRight, size: 16),
                onTap: () => Navigator.pushNamed(context, '/approvals'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetricCard(String title, String val, Color highlight) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF18181F),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: const TextStyle(fontSize: 10, color: Colors.white54, fontWeight: FontWeight.bold)),
          Text(val, style: TextStyle(fontSize: 20, fontWeight: FontWeight.black, color: highlight)),
        ],
      ),
    );
  }
}
