import PDFDocument from "pdfkit";

const generatePayslip = (res, payroll) => {
  const doc = new PDFDocument({ margin: 50 });

  const fileName = `Payslip_${payroll.employee.employeeId}_${payroll.month}_${payroll.year}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${fileName}"`
  );

  doc.pipe(res);

  // Title
  doc
    .fontSize(22)
    .text("Enterprise HRMS", {
      align: "center",
    });

  doc.moveDown();

  doc
    .fontSize(18)
    .text("Employee Payslip", {
      align: "center",
    });

  doc.moveDown(2);

  // Employee Details
  doc.fontSize(14).text("Employee Details", {
    underline: true,
  });

  doc.moveDown();

  doc.text(`Employee ID : ${payroll.employee.employeeId}`);
  doc.text(
    `Name : ${payroll.employee.firstName} ${payroll.employee.lastName}`
  );
  doc.text(`Email : ${payroll.employee.email}`);
  doc.text(`Designation : ${payroll.employee.designation}`);

  doc.moveDown();

  // Payroll Details
  doc.fontSize(14).text("Payroll Details", {
    underline: true,
  });

  doc.moveDown();

  doc.text(`Month : ${payroll.month}`);
  doc.text(`Year : ${payroll.year}`);

  doc.text(`Basic Salary : ₹${payroll.basicSalary}`);
  doc.text(`HRA : ₹${payroll.hra}`);
  doc.text(`Allowances : ₹${payroll.allowances}`);
  doc.text(`Deductions : ₹${payroll.deductions}`);

  doc.moveDown();

  doc
    .fontSize(16)
    .text(`Net Salary : ₹${payroll.netSalary}`, {
      underline: true,
    });

  doc.moveDown(3);

  doc
    .fontSize(12)
    .fillColor("gray")
    .text("This is a system generated payslip.", {
      align: "center",
    });

  doc.end();
};

export default generatePayslip;