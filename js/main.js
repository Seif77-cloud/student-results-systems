let students = [];

document.getElementById('addBtn').addEventListener('click', function() {
  let name = document.getElementById('studentName').value.trim();
  let g1 = Number(document.getElementById('grade1').value);
  let g2 = Number(document.getElementById('grade2').value);
  let g3 = Number(document.getElementById('grade3').value);
  let att = Number(document.getElementById('attendance').value);
  let errorBox = document.getElementById('errorBox');

  // التحقق
  if (!name || document.getElementById('grade1').value === '' || document.getElementById('grade2').value === '' || document.getElementById('grade3').value === '' || document.getElementById('attendance').value === '') {
    errorBox.textContent = 'من فضلك املأ كل البيانات';
    errorBox.classList.remove('d-none');
    return;
  }
  if (g1 < 0 || g1 > 100 || g2 < 0 || g2 > 100 || g3 < 0 || g3 > 100 || att < 0 || att > 100) {
    errorBox.textContent = 'الدرجات والحضور لازم تكون من 0 لـ 100';
    errorBox.classList.remove('d-none');
    return;
  }

  errorBox.classList.add('d-none');
  let avg = (g1 + g2 + g3) / 3;
  students.push({ name, grades: [g1, g2, g3], attendance: att, avg: avg, originalGrades: [g1, g2, g3] });
  showStudents();
  
  // مسح الحقول
  document.getElementById('studentName').value = '';
  document.getElementById('grade1').value = '';
  document.getElementById('grade2').value = '';
  document.getElementById('grade3').value = '';
  document.getElementById('attendance').value = '';
});

function showStudents() {
  let div = document.getElementById('studentsListDiv');
  if (students.length === 0) { div.innerHTML = 'لم يتم إضافة طلاب بعد.'; return; }
  let html = '<table class="table"><tr><th>الاسم</th><th>م1</th><th>م2</th><th>م3</th><th>المتوسط</th><th>الحضور</th></tr>';
  students.forEach(s => {
    html += `<tr><td>${s.name}</td><td>${s.grades[0]}</td><td>${s.grades[1]}</td><td>${s.grades[2]}</td><td>${s.avg.toFixed(1)}</td><td>${s.attendance}%</td></tr>`;
  });
  html += '</table>';
  div.innerHTML = html;
}

document.getElementById('raafaBtn').addEventListener('click', function() {
  let report = document.getElementById('reportDiv');
  if (students.length === 0) { report.innerHTML = 'مفيش طلاب عشان نطبق الرأفة'; return; }

  let html = '<table class="table"><tr><th>الاسم</th><th>قبل الرأفة</th><th>بعد الرأفة</th><th>النتيجة</th><th>ملاحظة</th></tr>';
  students.forEach(s => {
    let newGrades = [...s.grades];
    let note = 'لا يحتاج رأفة';
    let changed = false;

    // لجنة الرأفة: لو طالب راسب في مادة واحدة بس بدرجة من 45 لـ 49 وحضوره 75% او اكتر، نرفعه لـ 50
    let failCount = s.grades.filter(g => g < 50).length;
    if (failCount === 1 && s.attendance >= 75) {
      for (let i = 0; i < 3; i++) {
        if (newGrades[i] >= 45 && newGrades[i] < 50) {
          newGrades[i] = 50;
          changed = true;
          note = 'تم تطبيق الرأفة: رُفعت المادة من ' + s.grades[i] + ' إلى 50';
        }
      }
    } else if (failCount > 0 && s.attendance < 75) {
      note = 'لم تُطبق الرأفة: الحضور أقل من 75%';
    } else if (failCount > 1) {
      note = 'لم تُطبق الرأفة: راسب في أكثر من مادة';
    }

    let newAvg = (newGrades[0] + newGrades[1] + newGrades[2]) / 3;
    let result = newGrades.every(g => g >= 50) ? '✅ ناجح' : '❌ راسب';
    html += `<tr><td>${s.name}</td><td>${s.grades.join(' - ')}</td><td>${newGrades.join(' - ')}</td><td>${result}</td><td>${note}</td></tr>`;
  });
  html += '</table>';
  report.innerHTML = html;
});