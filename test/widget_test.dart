// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:drillsergeant/main.dart';

void main() {
  testWidgets('App renders', (WidgetTester tester) async {
    await tester.pumpWidget(const DrillSergeantApp());
    expect(find.byType(MaterialApp), findsNothing); // using MaterialApp.router
    expect(find.text('DrillSergeantX'), findsNothing); // title is in appBar in /home route after navigation
  });
}
