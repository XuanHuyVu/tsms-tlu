import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../viewmodels/schedule_viewmodel.dart';

class WeekCalendar extends StatelessWidget {
  const WeekCalendar({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<ScheduleViewModel>(
      builder: (context, viewModel, child) {
        final weekDates = viewModel.getWeekDates();

        return SizedBox(
          height: 100,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 8),
            itemCount: weekDates.length,
            itemBuilder: (context, index) {
              final date = weekDates[index];
              final isSelected = date.day == viewModel.selectedDate.day &&
                  date.month == viewModel.selectedDate.month &&
                  date.year == viewModel.selectedDate.year;
              final isToday = date.day == DateTime.now().day &&
                  date.month == DateTime.now().month &&
                  date.year == DateTime.now().year;

              return GestureDetector(
                onTap: () => viewModel.selectDate(date),
                child: Container(
                  width: 50,
                  margin: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
                  decoration: BoxDecoration(
                    color: isSelected ? const Color(0xFF4A90E2) :
                    isToday ? Colors.orange : Colors.transparent,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: isSelected || isToday ? Colors.transparent : Colors.grey[300]!,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        viewModel.getVietnameseDayName(date.weekday),
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: isSelected || isToday ? Colors.white : Colors.grey[700],
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${date.day}',
                        style: GoogleFonts.poppins(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: isSelected || isToday ? Colors.white : Colors.black87,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }
}