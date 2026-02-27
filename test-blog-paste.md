## Vấn đề thực tế: Bạn có data, nhưng báo cáo thì thủ công

Mỗi tháng, bạn nhận được file Excel chứa hàng nghìn dòng dữ liệu bán hàng — mã đơn, tên sản phẩm, số lượng, doanh thu, nhân viên, ngày giao dịch. Nhiệm vụ? Tổng hợp thành báo cáo doanh số gửi sếp.

Bạn bắt đầu lọc, copy-paste, viết SUMIFS, tạo PivotTable. Mỗi lần mất **30-60 phút**. Tháng sau? Lại từ đầu. Đó chính là lúc **VBA** trở thành "vũ khí bí mật" — chỉ cần **1 nút bấm**, toàn bộ quy trình chạy tự động trong vài giây.

[Gợi ý ảnh: Màn hình Excel với bảng dữ liệu bán hàng và báo cáo tổng hợp bên cạnh]

## Dữ liệu đầu vào

Giả sử bạn có sheet **Data** với các cột: Ngày, Nhân viên, Sản phẩm, Số lượng, Đơn giá, Thành tiền. Mục tiêu: tạo sheet **Báo cáo** tự động tổng hợp doanh số **theo nhân viên**, highlight người có doanh số cao nhất.

| Ngày       | Nhân viên | Sản phẩm    | Số lượng | Đơn giá   | Thành tiền  |
|------------|-----------|-------------|----------|-----------|-------------|
| 01/02/2026 | Hùng      | Laptop Dell | 2        | 18,500,000| 37,000,000  |
| 01/02/2026 | Mai       | iPhone 15   | 3        | 22,000,000| 66,000,000  |
| 02/02/2026 | Hùng      | Chuột Logi  | 10       | 850,000   | 8,500,000   |
| 03/02/2026 | Tuấn      | Bàn phím    | 5        | 1,200,000 | 6,000,000   |
| 03/02/2026 | Mai       | Màn hình    | 1        | 7,500,000 | 7,500,000   |

## Bước 1: Mở VBA Editor

Nhấn **Alt + F11** để mở VBA Editor:

1. Click chuột phải vào **VBAProject** trong cửa sổ Project
2. Chọn **Insert → Module**
3. Bạn đã sẵn sàng viết code

[Gợi ý ảnh: Giao diện VBA Editor với Module mới]

## Bước 2: Code tự động tạo báo cáo

```vba
Sub TaoBaoCaoDoanhSo()
    Dim wsData As Worksheet
    Dim wsReport As Worksheet
    Dim lastRow As Long
    Dim dict As Object
    Dim reportRow As Long
    Dim maxRevenue As Double
    Dim maxRow As Long
    
    Set wsData = ThisWorkbook.Sheets("Data")
    lastRow = wsData.Cells(wsData.Rows.Count, "A").End(xlUp).Row
    
    On Error Resume Next
    Application.DisplayAlerts = False
    ThisWorkbook.Sheets("Bao cao").Delete
    Application.DisplayAlerts = True
    On Error GoTo 0
    
    Set wsReport = ThisWorkbook.Sheets.Add(After:=ThisWorkbook.Sheets(ThisWorkbook.Sheets.Count))
    wsReport.Name = "Bao cao"
    
    Set dict = CreateObject("Scripting.Dictionary")
    
    Dim i As Long
    For i = 2 To lastRow
        Dim nv As String
        nv = wsData.Cells(i, 2).Value
        
        If Not dict.Exists(nv) Then
            dict.Add nv, Array(0, 0)
        End If
        
        Dim arr As Variant
        arr = dict(nv)
        arr(0) = arr(0) + 1
        arr(1) = arr(1) + wsData.Cells(i, 6).Value
        dict(nv) = arr
    Next i
    
    With wsReport
        .Cells(1, 1).Value = "BAO CAO DOANH SO"
        .Cells(1, 1).Font.Size = 16
        .Cells(1, 1).Font.Bold = True
        
        .Cells(3, 1).Value = "STT"
        .Cells(3, 2).Value = "Nhan vien"
        .Cells(3, 3).Value = "So don"
        .Cells(3, 4).Value = "Tong doanh thu"
        
        .Range("A3:D3").Font.Bold = True
        .Range("A3:D3").Interior.Color = RGB(0, 102, 204)
        .Range("A3:D3").Font.Color = RGB(255, 255, 255)
    End With
    
    reportRow = 4
    maxRevenue = 0
    Dim stt As Long: stt = 1
    
    Dim key As Variant
    For Each key In dict.Keys
        wsReport.Cells(reportRow, 1).Value = stt
        wsReport.Cells(reportRow, 2).Value = key
        wsReport.Cells(reportRow, 3).Value = dict(key)(0)
        wsReport.Cells(reportRow, 4).Value = dict(key)(1)
        wsReport.Cells(reportRow, 4).NumberFormat = "#,##0"
        
        If dict(key)(1) > maxRevenue Then
            maxRevenue = dict(key)(1)
            maxRow = reportRow
        End If
        
        stt = stt + 1
        reportRow = reportRow + 1
    Next key
    
    wsReport.Range("A" & maxRow & ":D" & maxRow).Interior.Color = RGB(255, 255, 0)
    wsReport.Columns("A:D").AutoFit
    
    MsgBox "Bao cao da tao thanh cong!", vbInformation
    wsReport.Activate
End Sub
```

## Giải thích các phần quan trọng

### Dictionary giúp tổng hợp nhanh

**Dictionary** hoạt động như bảng tra cứu nhanh, cho phép tổng hợp dữ liệu chỉ trong **1 lần duyệt** thay vì vòng lặp lồng nhau:

```vba
Set dict = CreateObject("Scripting.Dictionary")
```

### Highlight nhân viên xuất sắc

Code tự động tô màu vàng cho dòng có doanh thu cao nhất:

```vba
wsReport.Range("A" & maxRow & ":D" & maxRow).Interior.Color = RGB(255, 255, 0)
```

[Gợi ý ảnh: Báo cáo với header xanh dương và dòng highlight vàng]

## Mở rộng thêm

Khi nắm vững cơ bản, bạn có thể nâng cấp thêm:

- **Lọc theo thời gian** bằng InputBox cho người dùng chọn khoảng ngày
- **Tạo biểu đồ tự động** bằng Charts.Add
- **Xuất PDF** bằng ExportAsFixedFormat

```vba
wsReport.ExportAsFixedFormat _
    Type:=xlTypePDF, _
    Filename:=ThisWorkbook.Path & "\BaoCao.pdf"
```

## Tổng kết

Chỉ với khoảng **80 dòng code VBA**, bạn đã xây dựng được hệ thống tự động: tổng hợp doanh số bằng **Dictionary**, tạo báo cáo có **header đẹp** và **định dạng số**, **highlight** nhân viên xuất sắc, tất cả chỉ với **1 click**.

EXCERPT: Hướng dẫn tự động hoá báo cáo doanh số bằng VBA Excel, từ dữ liệu thô đến báo cáo chuyên nghiệp chỉ với 1 click.
KEYWORDS: Excel VBA, tự động hoá báo cáo, macro Excel, Dictionary VBA, báo cáo doanh số, Excel automation
COVER_IMAGE: Màn hình máy tính hiển thị Excel với bảng dữ liệu bán hàng bên trái và báo cáo tổng hợp format chuyên nghiệp bên phải, tone xanh dương trắng.
