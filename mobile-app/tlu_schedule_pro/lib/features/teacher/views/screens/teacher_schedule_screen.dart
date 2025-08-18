import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../viewmodels/teacher_schedule_viewmodel.dart';
import '../../models/schedule_model.dart';
import '../widgets/schedule_card.dart';

String _two(int n) => n.toString().padLeft(2, '0');
String _ddMMyyyy(DateTime d) => '${_two(d.day)}/${_two(d.month)}/${d.year}';
String _weekdayVi(DateTime d) {
  const names = ['CN','Th 2','Th 3','Th 4','Th 5','Th 6','Th 7'];
  return names[d.weekday % 7];
}

class TeacherScheduleScreen extends StatelessWidget {
  const TeacherScheduleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => TeacherScheduleViewModel()..load(),
      child: const _Body(),
    );
  }
}

class _Body extends StatefulWidget {
  const _Body();

  @override
  State<_Body> createState() => _BodyState();
}

class _BodyState extends State<_Body> with TickerProviderStateMixin {
  late final TabController _tab = TabController(length: 2, vsync: this);

  @override
  Widget build(BuildContext context) {
    final vm = context.watch<TeacherScheduleViewModel>();

    if (vm.loading) {
      return const SafeArea(child: Center(child: CircularProgressIndicator()));
    }
    if (vm.error != null) {
      return SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Text('Lỗi: ${vm.error}', textAlign: TextAlign.center),
          ),
        ),
      );
    }

    return SafeArea(
      child: Column(
        children: [
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            child: Row(
              children: [
                const Expanded(
                  child: Text('Lịch dạy',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                ),
                IconButton(onPressed: () {}, icon: const Icon(Icons.notifications_rounded)),
                IconButton(onPressed: () {}, icon: const Icon(Icons.search_rounded)),
              ],
            ),
          ),
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: TabBar(
              controller: _tab,
              indicator: BoxDecoration(
                color: Colors.blue,
                borderRadius: BorderRadius.circular(8),
              ),
              indicatorSize: TabBarIndicatorSize.tab,
              labelColor: Colors.white,
              unselectedLabelColor: Colors.blue,
              tabs: const [Tab(text: 'Ngày'), Tab(text: 'Tuần')],
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: TabBarView(
              controller: _tab,
              children: const [_DayTab(), _WeekTab()],
            ),
          ),
        ],
      ),
    );
  }
}

class _DayTab extends StatelessWidget {
  const _DayTab();

  @override
  Widget build(BuildContext context) {
    final vm = context.watch<TeacherScheduleViewModel>();
    final d = vm.selectedDate;

    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      children: [
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(.06),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
            border: Border.all(color: Colors.black12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
          child: Column(
            children: [
              Text('${d.day}',
                  style: const TextStyle(fontSize: 56, fontWeight: FontWeight.w900)),
              const SizedBox(height: 6),
              Text(
                '${_weekdayVi(d)}, ${d.day} tháng ${d.month} năm ${d.year}',
                style: const TextStyle(color: Colors.black54),
              ),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                onPressed: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: vm.selectedDate,
                    firstDate: DateTime(2020),
                    lastDate: DateTime(2035),
                  );
                  if (picked != null) vm.pickDate(picked);
                },
                icon: const Icon(Icons.event),
                label: Text('Chọn ngày (${_ddMMyyyy(d)})'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        ...vm.daySchedules.map((e) => ScheduleCard(item: e)),
        if (vm.daySchedules.isEmpty)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 40),
            child: Center(child: Text('Không có lịch cho ngày này.')),
          ),
      ],
    );
  }
}

class _WeekTab extends StatelessWidget {
  const _WeekTab();

  @override
  Widget build(BuildContext context) {
    final vm = context.watch<TeacherScheduleViewModel>();

    final monday = vm.selectedDate.subtract(Duration(days: vm.selectedDate.weekday - 1));
    final days = List.generate(7, (i) => monday.add(Duration(days: i)));

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(12, 8, 12, 4),
          child: Row(
            children: [
              IconButton(onPressed: () => vm.shiftWeek(-1), icon: const Icon(Icons.chevron_left)),
              Expanded(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: days.map((d) {
                    final sel = d.year == vm.selectedDate.year &&
                        d.month == vm.selectedDate.month &&
                        d.day == vm.selectedDate.day;
                    return GestureDetector(
                      onTap: () => vm.pickDate(d),
                      child: Container(
                        width: 40,
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: sel ? Colors.blue : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Column(
                          children: [
                            Text(_weekdayVi(d),
                                style: TextStyle(
                                    fontSize: 12,
                                    color: sel ? Colors.white : Colors.black54)),
                            const SizedBox(height: 4),
                            Text('${d.day}',
                                style: TextStyle(
                                    fontWeight: FontWeight.w800,
                                    color: sel ? Colors.white : Colors.black87)),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
              IconButton(onPressed: () => vm.shiftWeek(1), icon: const Icon(Icons.chevron_right)),
            ],
          ),
        ),
        const SizedBox(height: 4),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            children: vm.weekGrouped.entries.expand((entry) {
              final date = entry.key;
              final list = entry.value;
              return [
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: Text(
                    '${_weekdayVi(date)}, ${_ddMMyyyy(date)}',
                    style: const TextStyle(
                        fontWeight: FontWeight.w800, color: Colors.blue),
                  ),
                ),
                ...list.map((e) => ScheduleCard(item: e)),
              ];
            }).toList(),
          ),
        ),
      ],
    );
  }
}
