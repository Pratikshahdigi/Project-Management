import 'package:flutter/material';
import 'package:provider/provider';
import 'screens/dashboard.dart';
import 'screens/tasks.dart';
import 'screens/approvals.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthStateProvider()),
      ],
      child: const AgencyOSApp(),
    ),
  );
}

class AgencyOSApp extends StatelessWidget {
  const AgencyOSApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Agency OS Mobile',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF09090C),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF8B5CF6),
          secondary: Color(0xFF10B981),
          surface: Color(0xFF18181F),
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const MobileDashboard(),
        '/tasks': (context) => const TasksScreen(),
        '/approvals': (context) => const ApprovalsScreen(),
      },
    );
  }
}

class AuthStateProvider extends ChangeNotifier {
  String _accessToken = '';
  String _role = 'CEO';
  String _email = 'ceo@agency.com';

  String get accessToken => _accessToken;
  String get role => _role;
  String get email => _email;

  void authenticate(String token, String userRole, String userEmail) {
    _accessToken = token;
    _role = userRole;
    _email = userEmail;
    notifyListeners();
  }
}
