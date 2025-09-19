import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiClient {
  final String baseUrl;
  String? _authToken;

  ApiClient({String? baseUrl})
      : baseUrl = baseUrl ?? const String.fromEnvironment('API_BASE_URL', defaultValue: 'http://localhost:8080');

  void setAuthToken(String token) {
    _authToken = token;
  }

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_authToken != null) 'Authorization': 'Bearer $_authToken',
  };

  // ============ AUTH ============
  Future<Map<String, dynamic>> verifyToken(String idToken) async {
    final response = await http.post(
      Uri.parse('$baseUrl/v1/auth/verifyToken'),
      headers: _headers,
      body: json.encode({'idToken': idToken}),
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Token verification failed: ${response.body}');
    }
  }

  // ============ USERS ============
  Future<Map<String, dynamic>> getMe() async {
    final response = await http.get(
      Uri.parse('$baseUrl/v1/users/me'),
      headers: _headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get user: ${response.body}');
    }
  }

  Future<Map<String, dynamic>> updateMe(Map<String, dynamic> updates) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/v1/users/me'),
      headers: _headers,
      body: json.encode(updates),
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to update user: ${response.body}');
    }
  }

  // ============ BRIEF ============
  Future<Map<String, dynamic>> getBriefToday() async {
    final response = await http.get(
      Uri.parse('$baseUrl/v1/brief/today'),
      headers: _headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get brief: ${response.body}');
    }
  }

  // ============ HABITS ============
  Future<List<dynamic>> getHabits() async {
    final response = await http.get(
      Uri.parse('$baseUrl/v1/habits'),
      headers: _headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load habits: ${response.body}');
    }
  }

  Future<Map<String, dynamic>> createHabit(Map<String, dynamic> habitData) async {
    final response = await http.post(
      Uri.parse('$baseUrl/v1/habits'),
      headers: _headers,
      body: json.encode(habitData),
    );
    
    if (response.statusCode == 200 || response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to create habit: ${response.statusCode} ${response.body}');
    }
  }

  Future<Map<String, dynamic>> tickHabit(String habitId, {String? idempotencyKey}) async {
    final headers = Map<String, String>.from(_headers);
    if (idempotencyKey != null) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    final response = await http.post(
      Uri.parse('$baseUrl/v1/habits/$habitId/tick'),
      headers: headers,
      body: json.encode({}),
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to tick habit: ${response.body}');
    }
  }

  // ============ CHAT ============
  Future<Map<String, dynamic>> sendChatMessage(String message, {String mode = 'balanced'}) async {
    final response = await http.post(
      Uri.parse('$baseUrl/v1/chat'),
      headers: _headers,
      body: json.encode({
        'message': message,
        'mode': mode,
      }),
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to send chat message: ${response.body}');
    }
  }

  // ============ VOICE ============
  Future<Map<String, dynamic>> getVoicePreset(String presetId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/v1/voice/preset/$presetId'),
      headers: _headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get voice preset: ${response.body}');
    }
  }

  Future<Map<String, dynamic>> ttsVoice(String text, {String voice = 'balanced'}) async {
    final response = await http.post(
      Uri.parse('$baseUrl/v1/voice/tts'),
      headers: _headers,
      body: json.encode({
        'text': text,
        'voice': voice,
      }),
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else if (response.statusCode == 402) {
      throw Exception('TTS quota exceeded or PRO plan required');
    } else {
      throw Exception('Failed to generate TTS: ${response.body}');
    }
  }

  // ============ ALARMS ============
  Future<List<dynamic>> getAlarms() async {
    final response = await http.get(
      Uri.parse('$baseUrl/v1/alarms'),
      headers: _headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load alarms: ${response.body}');
    }
  }

  Future<Map<String, dynamic>> createAlarm(Map<String, dynamic> alarmData) async {
    final response = await http.post(
      Uri.parse('$baseUrl/v1/alarms'),
      headers: _headers,
      body: json.encode(alarmData),
    );
    
    if (response.statusCode == 200 || response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to create alarm: ${response.statusCode} ${response.body}');
    }
  }

  Future<Map<String, dynamic>> dismissAlarm(String alarmId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/v1/alarms/$alarmId/dismiss'),
      headers: _headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to dismiss alarm: ${response.body}');
    }
  }

  Future<void> deleteAlarm(String alarmId) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/v1/alarms/$alarmId'),
      headers: _headers,
    );
    
    if (response.statusCode != 200) {
      throw Exception('Failed to delete alarm: ${response.body}');
    }
  }

  // ============ ANTI-HABITS ============
  Future<List<dynamic>> getAntiHabits() async {
    final response = await http.get(
      Uri.parse('$baseUrl/v1/antihabits'),
      headers: _headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load anti-habits: ${response.body}');
    }
  }

  Future<Map<String, dynamic>> recordSlip(String antiHabitId, {String? idempotencyKey}) async {
    final headers = Map<String, String>.from(_headers);
    if (idempotencyKey != null) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    final response = await http.post(
      Uri.parse('$baseUrl/v1/antihabits/$antiHabitId/slip'),
      headers: headers,
      body: json.encode({}),
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to record slip: ${response.body}');
    }
  }

  // ============ BILLING ============
  Future<Map<String, dynamic>> getBillingUsage() async {
    final response = await http.get(
      Uri.parse('$baseUrl/v1/billing/usage'),
      headers: _headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get billing usage: ${response.body}');
    }
  }

  Future<Map<String, dynamic>> createCheckoutSession() async {
    final response = await http.post(
      Uri.parse('$baseUrl/v1/billing/checkout'),
      headers: _headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to create checkout session: ${response.body}');
    }
  }

  Future<Map<String, dynamic>> createPortalSession() async {
    final response = await http.post(
      Uri.parse('$baseUrl/v1/billing/portal'),
      headers: _headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to create portal session: ${response.body}');
    }
  }

  // ============ STREAKS ============
  Future<Map<String, dynamic>> getAchievements() async {
    final response = await http.get(
      Uri.parse('$baseUrl/v1/streaks/achievements'),
      headers: _headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get achievements: ${response.body}');
    }
  }

  Future<Map<String, dynamic>> getStreakSummary() async {
    final response = await http.get(
      Uri.parse('$baseUrl/v1/streaks/summary'),
      headers: _headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get streak summary: ${response.body}');
    }
  }

  // ============ POLICIES & ACCOUNT ============
  Future<Map<String, dynamic>> getCurrentPolicies() async {
    final response = await http.get(
      Uri.parse('$baseUrl/v1/policies/current'),
      headers: _headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get policies: ${response.body}');
    }
  }

  Future<Map<String, dynamic>> exportAccountData() async {
    final response = await http.post(
      Uri.parse('$baseUrl/v1/account/export'),
      headers: _headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to export data: ${response.body}');
    }
  }

  Future<Map<String, dynamic>> deleteAccount() async {
    final response = await http.post(
      Uri.parse('$baseUrl/v1/account/delete'),
      headers: _headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to delete account: ${response.body}');
    }
  }
}

final apiClient = ApiClient(); 
