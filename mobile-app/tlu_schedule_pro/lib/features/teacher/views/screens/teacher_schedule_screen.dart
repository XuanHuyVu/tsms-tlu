import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../viewmodels/teacher_schedule_viewmodel.dart';
import '../../models/schedule_model.dart';
import '../widgets/schedule_card.dart';

/// ---- Config & helpers -------------------------------------------------------

const _brandBlue = Color(0xFF4A90E2);

String _two(int n) => n.toString().padLeft(2, '0');
String _ddMMyyyy(DateTime d) => '${_two(d.day)}/${_two(d.month)}/${d.year}';

String _weekdayShort(DateTime d) {
  const names = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return names[d.weekday % 7];
}

String _weekdayFull(DateTime d) {
  const names = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
  return names[d.weekday % 7];
}

/// ---- Entry Screen -----------------------------------------------------------

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
          _ScheduleAppBar(
            title: 'LỊCH DẠY',
            onBack: () => Navigator.of(context).maybePop(),
            notifCount: 0,
          ),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: Colors.grey.shade200,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Padding(
                padding: const EdgeInsets.all(3),
                child: TabBar(
                  controller: _tab,
                  indicator: BoxDecoration(
                    color: _brandBlue,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  indicatorSize: TabBarIndicatorSize.tab,
                  dividerColor: Colors.transparent,
                  labelColor: Colors.white,
                  unselectedLabelColor: Colors.black87,
                  tabs: const [Tab(text: 'Hôm nay'), Tab(text: 'Tuần này')],
                ),
              ),
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

/// ---- AppBar component -------------------------------------------------------

class _ScheduleAppBar extends StatelessWidget {
  final String title;
  final VoidCallback? onBack;
  final int notifCount;

  const _ScheduleAppBar({
    required this.title,
    this.onBack,
    this.notifCount = 0,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: _brandBlue,
      padding: const EdgeInsets.fromLTRB(4, 8, 12, 8),
      child: Row(
        children: [
          const SizedBox(width: 4),
          Text(
            title.toUpperCase(),
            style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w800),
          ),
          const Spacer(),
          Stack(
            clipBehavior: Clip.none,
            children: [
              IconButton(
                onPressed: () {},
                icon: const Icon(Icons.notifications_rounded, color: Colors.white),
              ),
              if (notifCount > 0)
                Positioned(
                  right: 6,
                  top: 6,
                  child: Container(
                    padding: const EdgeInsets.all(3),
                    decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                    constraints: const BoxConstraints(minWidth: 18, minHeight: 18),
                    child: Text(
                      '$notifCount',
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}

/// ---- Tab: Ngày --------------------------------------------------------------

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
              BoxShadow(color: _brandBlue.withValues(alpha: .06), blurRadius: 10, offset: const Offset(0, 4)),
            ],
            border: Border.all(color: _brandBlue.withValues(alpha: .18)),
          ),
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
          child: Column(
            children: [
              Text('${d.day}', style: const TextStyle(fontSize: 56, fontWeight: FontWeight.w900)),
              const SizedBox(height: 6),
              Text('${_weekdayFull(d)}, ${d.day} tháng ${d.month} năm ${d.year}',
                  style: const TextStyle(color: Colors.black87)),
            ],
          ),
        ),
        const SizedBox(height: 12),

        /// ✅ KÍCH HOẠT 2 NÚT: truyền callback vào ScheduleCard
        ...vm.daySchedules.map(
              (e) => ScheduleCard(
            item: e,
            onMarkDone: () => context.read<TeacherScheduleViewModel>().markDone(e),
            onRequestCancel: (reason, fileUrl) =>
                context.read<TeacherScheduleViewModel>().requestCancel(
                  e,
                  reason: reason,
                  fileUrl: fileUrl,
                ),
          ),
        ),

        if (vm.daySchedules.isEmpty)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 40),
            child: Center(child: Text('Không có lịch cho ngày này.')),
          ),
      ],
    );
  }
}

/// ---- Tab: Tuần --------------------------------------------------------------

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
                child: SizedBox(
                  height: 64,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: days.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 4),
                    itemBuilder: (context, i) {
                      final day = days[i];
                      final isSelected = day.year == vm.selectedDate.year &&
                          day.month == vm.selectedDate.month &&
                          day.day == vm.selectedDate.day;
                      return GestureDetector(
                        onTap: () => vm.pickDate(day),
                        child: Container(
                          width: 44,
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          decoration: BoxDecoration(
                            color: isSelected ? _brandBlue : Colors.transparent,
                            border: Border.all(
                              color: isSelected ? _brandBlue : _brandBlue.withValues(alpha: .25),
                            ),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(_weekdayShort(day),
                                  style: TextStyle(fontSize: 12, color: isSelected ? Colors.white : Colors.black54)),
                              const SizedBox(height: 4),
                              Text('${day.day}',
                                  style: TextStyle(
                                      fontWeight: FontWeight.w800,
                                      color: isSelected ? Colors.white : Colors.black87)),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
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
                    '${_weekdayFull(date)}, ${_ddMMyyyy(date)}',
                    style: const TextStyle(fontWeight: FontWeight.w800, color: _brandBlue),
                  ),
                ),

                /// ✅ KÍCH HOẠT 2 NÚT cho từng item trong tuần
                ...list.map(
                      (e) => ScheduleCard(
                    item: e,
                    onMarkDone: () => context.read<TeacherScheduleViewModel>().markDone(e),
                    onRequestCancel: (reason, fileUrl) =>
                        context.read<TeacherScheduleViewModel>().requestCancel(
                          e,
                          reason: reason,
                          fileUrl: fileUrl,
                        ),
                  ),
                ),
              ];
            }).toList(),
          ),
        ),
      ],
    );
  }
}
