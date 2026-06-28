const rawAnswers = `
1-20: 1.B; 2.C; 3.B; 4.A; 5.D; 6.C; 7.A; 8.A; 9.A;10a).D; 10b).C; 11.C; 12.B; 13.D; 14.C; 15.B; 16.A; 17.B; 18.D; 19.C; 20.C
21-40: 21.C; 22.C; 23.D; 24.B; 25.A; 26.B; 27.A; 28.D; 29.B; 30.B; 31.A; 32.A; 33.A; 34.A; 35.A; 36.B; 37.A; 38.A; 39.B; 40.D
41-60: 41.C; 42.C; 43.B; 44.B; 45.B; 46.B; 47.C; 48.C; 49.B; 50.A; 51.D; 52.B; 53.C; 54.A; 55.D; 56.A; 57.D; 58.B; 59.D; 60.A
61-80: 61.A; 62.C; 63.B; 64.C; 65.B; 66.C; 67.B; 68.B; 69.A; 70.D; 71.B; 72.C; 73.B; 74.A; 75.A; 76.C; 77.A; 78.B; 79.A; 80.B
81-100: 81.D; 82.C; 83.A; 84.D; 85.D; 86.D; 87.C; 88.D; 89.B; 90.A; 91.A; 92.B; 93.B; 94.D; 95.B; 96.B; 97.C; 98.B; 99.C; 100.C
101-120: 101.D; 102.B; 103.B; 104.C; 105.D; 106.A; 107.A; 108.D; 109.A; 110.C; 111.A; 112.A; 113.B; 114.C; 115.B; 116.D; 117.C; 118.C; 119.B; 120.B
121-140: 121.D; 122.A; 123.C; 124.D; 125.B; 126.D; 127.C; 128.A; 129.C; 130.C; 131.C; 132.A; 133.C; 134.C; 135.A; 136.B; 137.B; 138.B; 139.A; 140.C
141-160: 141.A; 142.B; 143.B; 144.A; 145.A; 146.C; 147.D; 148.B; 149.C; 150.A; 151.C; 152.D; 153.C; 154.B; 155.C; 156.A; 157.C; 158.B; 159.A; 160.D
161-180: 161.D; 162.B; 163.C; 164.C; 165.C; 166.C; 167.A; 168.B; 169.C; 170.C; 171.D; 172.A; 173.B; 174.D; 175.C; 176.B; 177.B; 178.A; 179.A; 180.B
181-200: 181.B; 182.B; 183.C; 184.A; 185.B; 186.B; 187.A; 188.A; 189.B; 190.A; 191.C; 192.B; 193.A; 194.B; 195.B; 196.A; 197.A; 198.C; 199.D; 200.B
201-220: 201.D; 202.C; 203.A; 204.B; 205.A; 206.B; 207.B; 208.B; 209.B; 210.C; 211.C; 212.B; 213.C; 214.C; 215.D; 216.C; 217.B; 218.B; 219.D; 220.B
221-240: 221.A; 222.D; 223.A; 224.D; 225.A; 226.A; 227.A; 228.A; 229.D; 230.A; 231.C; 232.B; 233.B; 234.D; 235.D; 236.B; 237.A; 238.A; 239.C; 240.A
241-260: 241.B; 242.D; 243.B; 244.A; 245.A; 246.B; 247.D; 248.B; 249.C; 250.A; 251.A; 252.A; 253.B; 254.B; 255.C; 256.A; 257.B; 258.B; 259.D; 260.A
261-280: 261.B; 262.A; 263.C; 264.B; 265.D; 266.D; 267.C; 268.A; 269.A; 270.B; 271.D; 272.D; 273.C; 274.A; 275.A; 276.C; 277.A; 278.C; 279.C; 280.C
281-290: 281.A; 282.D; 283.A; 284.B; 285.C; 286.B; 287.D; 288.D; 289.B; 290.C
`;

let defaultQuestions = [];

function buildBaseQuestions() {
    const regex = /(\d+[ab]?)\)?\s*\.\s*([A-D])/g;
    let match;
    
    while ((match = regex.exec(rawAnswers)) !== null) {
        const id = match[1];
        const correctOpt = match[2];
        const num = parseInt(id); 
        
        let chapter = 0;
        if (num <= 44) {
            chapter = 1;
        } else if (num >= 45 && num <= 223) {
            chapter = 2;
        } else {
            chapter = 3;
        }

        defaultQuestions.push({
            id: id,
            chapter: chapter,
            text: `[CHƯA CÓ NỘI DUNG] Đây là câu hỏi số ${id}.`,
            options: {},
            correct: correctOpt
        });
    }
}
buildBaseQuestions();

// Đây là văn bản bạn cung cấp, tôi đưa nó vào đây để tự động nạp.
const rawQuestionText = `PHẦN C: CÂU HỎI TRẮC NGHIỆM

CHƯƠNG 1.

1) Việc giải quyết mặt thứ 2 vấn đề cơ bản của triết học là căn cứ phân chia các học thuyết triết học thành:
A. Chủ nghĩa duy thực và chủ nghĩa duy danh.
B. Khả tri luận và bất khả tri luận.
C. Chủ nghĩa duy vật và khả tri luận.
D. Chủ nghĩa duy tâm và bất khả tri.
 2) Triết học tự nhiên đã được những thành tựu rực rỡ trong nền triết học nào?
A. Triết học Trung Quốc Cổ đại.
B. Triết học Ấn Độ cổ đại.
C. Triết học Hy Lạp cổ đại.
D. Triết học cổ điển Đức.
3) Nền triết học nào được gọi là “triết học tôn giáo”?
A. Triết học Trung Quốc Cổ đại.
B. Triết học Ấn Độ cổ đại.
C. Triết học Hy Lạp cổ đại.
D. Triết học Tây Âu thời trung cổ.
4) Nền triết học nào mà đối tượng nghiên cứu tập trung vào các vấn đề chính trị, đạo đức, xã hội? 
A. Triết học Trung Quốc Cổ đại.
B. Triết học Ấn Độ cổ đại.
C. Triết học Hy Lạp cổ đại.
D. Triết học Mác – Lênin
5) Thế giới quan bao gồm những hình thức cơ bản nào?
A. Thế giới quan tôn giáo.
B. Thế giới quan thần thoại.
C. Thế giới quan triết học.
D. Tất cả đáp án của câu này đều đúng.

6) Ý thức có trước, vật chất có sau, ý thức quyết định vật chất. Đây là quan điểm của trường phái triết học nào?
a. Duy vật.
b. Duy tâm chủ quan.
c. Duy tâm.
d. Nhị nguyên.
7) Vật chất có trước, ý thức có sau, vật chất quyết định ý thức. Đây là quan điểm của trường phái triết học nào?
a. Duy vật.
b. Duy tâm chủ quan
c. Nhị tâm,
d. Nhị nguyên
8) Chủ nghĩa duy vật quan niệm về mối quan hệ giữa vật chất và ý thức như sau?
a. Vật chất có trước, ý thức có sau.
b. Ý thức có trước, vật chất có sau.
c. Vật chất và ý thức không có cái nào có trước, không có cái nào có sau.
d. Vật chất và ý thức tồn tại song song.
9) Ý thức, cảm giác của con người có trước, sinh ra và quyết định sự tồn tại của các sự vật. Quan điểm này thuộc trường phái Triết học nào?
a. Duy tâm chủ quan.
b. Duy tâm.
c. Duy tâm khách quan.
d. Duy vật.
10a) Ý niệm tuyệt đối, tinh thần tuyệt đối là nguồn gốc sinh ra thế giới, đây là quan điểm của trường phái Triết học nào?
a. Duy vật.
b. Duy tâm chủ quan.
c. Duy tâm.
d. Duy tâm khách quan.
10b) Cấp độ phát triển cao nhất của thế giới quan là:
a. Thế giới quan Thần thoại
b. Thế giới quan Tôn giáo
c. Thế giới quan Triết học
d. Thế giới quan Kinh nghiệm
11) Cấp độ phát triển cao nhất của thế giới quan là:
a. Thế giới quan Thần thoại
b. Thế giới quan Tôn giáo
c. Thế giới quan Triết học
d. Thế giới quan Kinh nghiệm
12) Hãy sắp xếp theo trình tự xuất hiện từ sớm nhất đến muộn nhất các hình thức thế giới quan sau?
a. Tôn giáo - Thần thoại - Triết học.
b. Thần thoại - Tôn giáo - Triết học.
c. Triết học - Tôn giáo - Thần thoại.
d. Thần thoại - Triết học - Tôn giáo.
13) Triết học là gì?
a. Triết học là tri thức về giới tự nhiên.
b. Triết học là tri thức về tự nhiên và xã hội.
c. Triết học là tri thức lý luận về con người về vật chất.
d. Triết học là hệ thống lý luận chung nhất của con người về thế giới và vị trí con
người trong thế giới.
14) Triết học ra đời trong điều kiện nào?
a. Xã hội phân chia thành giai cấp.
b. Xuất hiện tầng lớp lao động trí óc.
c. Tư duy của con người đạt trình độ tư duy khái quát cao, xã hội phân chia giai cấp và phân công lao động.
d. Xuất hiện giai cấp tư sản.
15) Mặt thứ hai trong vấn đề cơ bản của triết học là:
a. Giữa vật chất và ý thức thì cái nào có trước, cái nào có sau, cái nào quyết định cái nào.
b. Con người có khả năng nhận thức được thế giới hay không.
c. Vấn đề mối quan hệ giữa vật chất và ý thức.
d. Vấn đề giữa tư duy và tồn tại.
16) Quan điểm của trường phái nào cho rằng: vật chất có trước, ý thức có sau, vật chất sinh ra ý thức như gan tiết ra mật?
a. Duy vật siêu hình.
b. Duy vật biện chứng
c. Duy tâm chủ quan
d. Duy tâm khách quan.
17) Quan điểm nào cho rằng các sự vật hiện tượng, các quá trình khác nhau vừa tồn tại độc lập, vừa quy định, tác động qua lại, chuyển hoá lẫn nhau?
a. Quan điểm siêu hình.
b. Quan điểm biện chứng.
c. Quan điểm duy tâm.
d. Quan điểm duy thực.
Quan điểm: “Vật chất và ý thức là hai nguyên thể đầu tiên cùng song song tồn tại” là quan điểm của trường phái triết học nào?
a. Duy vật biện chứng.
b. Duy tâm khách quan.
c. Duy vật siêu hình.
d. Nhị nguyên luận.
Chức năng của triết học Mác- Lênin là:
a. Giải thích cấu trúc thế giới.
b. Xây dựng phương pháp cho các khoa học
c. Xác lập thế giới quan, phương pháp luận chung nhất cho hoạt động nhận thức và thực tiễn.
d. Giải thích các hiện tượng tâm linh.
Nội dung Triết học Mác- Lênin bao gồm?
a. Chủ nghĩa duy vật biện chứng và chủ nghĩa duy vật siêu hình.
b. Chủ nghĩa duy tâm và chủ nghĩa duy vật.
c. Chủ nghĩa duy vật biện chứng và chủ nghĩa duy vật lịch sử.
d. Chủ nghĩa duy vật và chủ nghĩa duy tâm.
Trong triết học Mác- Lênin thì:
a. Chủ nghĩa duy vật và Phép siêu hình gắn liền với nhau.
b. Chủ nghĩa duy tâm và Phép biện chứng gắn liền với nhau.
c. Chủ nghĩa duy vật và Phép biện chứng gắn liền với nhau.
d. Chủ nghĩa duy vật và Chủ nghĩa duy tâm gắn liền với nhau.
Các bộ phận lý luận cơ bản cấu thành chủ nghĩa Mác- Lênin:
a. Triết học, Nghệ thuật, Chính trị
b. Triết học, Chính trị, Tôn giáo
c. Triết học Mác- Lênin; Kinh tế chính trị học Mác- Lênin; Chủ nghĩa xã hội khoa học
d. Triết học Mác- Lênin; Kinh tế chính trị học Mác- Lênin     
Khái niệm triết học (philosophia) thời Hy Lạp cổ đại nghĩa là gì?
a. Nhân sinh quan của con người
b. Con đường suy ngẫm để đi đến chân lý
c. Thế giới quan của con người
d. Yêu mến sự thông thái
Mặt thứ hai trong vấn đề cơ bản của triết học là gì?
a. Cuộc sống con người sẽ đi về đâu?
b. Con người có khả năng nhận thức được thế giới không?
c. Con người hoàn toàn có khả năng nhận thức được thế giới.
d. Cả ba đáp án trên.
Về thực chất, chủ nghĩa nhị nguyên triết học có cùng bản chất với hệ thống triết lý nào?
a. Chủ nghĩa duy tâm
b. Chủ nghĩa xét lại triết học.
c. Chủ nghĩa hoài nghi
d. Chủ nghĩa tương đối.
Đặc trưng cơ bản của phép biện chứng cổ đại là gì?
a. Biện chứng duy tâm.
b. Biện chứng ngây thơ, chất phác.
c. Biện chứng duy vật khoa học.
d. Biện chứng chủ quan.
Điểm chung trong quan niệm của các nhà triết học duy vật thời kỳ cổ đại về vật chất là:
a. Đồng nhất vật chất với vật thể cụ thể cảm tính, với thuộc tính phổ biến của vật
thể.
b. Đồng nhất vật chất với nguyên tử.
c. Đồng nhất vật chất với thực tại khách quan.
d. Đồng nhất vật chất với nước.
Điều kiện kinh tế xã hội cho sự ra đời của triết học Mác- Lênin?
a. Phương thức sản xuất tư bản chủ nghĩa được củng cố và phát triển.
b. Giai cấp vô sản ra đời và trở thành lực lượng chính trị - xã hội độc lập.
c. Trình độ khoa học tự nhiên, khoa học kỹ thuật phát triển.
d. Tất cả đáp án
Ba phát minh lớn nhất của khoa học tự nhiên làm cơ sở cho sự ra đời tư duy biện chứng duy vật đầu thế kỷ XIX là những phát minh nào?
a. Thuyết mặt trời làm trung tâm vũ trụ của Côpecních, định luật bảo toàn khối lượng của Lômônôxốp, Học thuyết tế bào.
b. Định luật bảo toàn và chuyển hóa năng lượng, Học thuyết tế bào, Học thuyết tiến hóa.
c. Phát hiện ra nguyên tử, Phát hiện ra điện tử, Định luật bảo toàn và chuyển hóa năng lượng.
d. Phát hiện ra nguyên tử, Phát hiện ra điện tử, Học thuyết tế bào.
Phát minh nào trong khoa học tự nhiên nửa đầu thế kỷ XIX vạch ra nguồn gốc tự nhiên của con người, chống lại quan điểm tôn giáo?
a. Học thuyết tế bào.
b. Học thuyết tiến hóa.
c. Định luật bảo toàn và chuyển hóa năng lượng.
d. Thuyết duy lý.
Phát minh nào trong khoa học tự nhiên nửa đầu thế kỷ XIX vạch ra sự thống nhất giữa thế giới động vật và thực vật?
a. Học thuyết tế bào.
b. Học thuyết tiến hóa.
c. Định luật bảo toàn và chuyển hóa năng lượng.
d. Thuyết duy lý.
Thực chất bước ngoặt cách mạng trong triết học do Mác và Ăngghen thực hiện là nội dung nào sau đây?
a. Thống nhất giữa thế giới quan duy vật và phép biện chứng trong một hệ thống triết học.
b. Thống nhất giữa triết học của Hêghen và triết học của Phoiơbắc.
c. Phê phán triết học duy tâm của Hêghen.
d. Khái quát các thành tựu triết học trước đó.
Triết học Mác- Lênin nghiên cứu cái gì?
a. Những quy luật chung nhất của tự nhiên, xã hội và tư duy.
b. Quan hệ giữa người với người hình thành trong quá trình sản xuất, phân phối, trao đổi và tiêu dùng của cải vật chất.
c. Những quy luật chính trị - xã hội của quá trình phát sinh, hình thành và phát triển của xã hội cộng sản chủ nghĩa.
d. Các quy luật của tư duy.
Cho rằng có thế giới tinh thần có trước, sinh ra và tồn tại độc lập bên cạnh thế giới vật chất sẽ rơi vào quan điểm triết học nào?
a. Chủ nghĩa duy tâm.
b. Chủ nghĩa duy vật biện chứng.
c. Chủ nghĩa duy vật siêu hình.
d. Chủ nghĩa hiện sinh.
Nhà triết học nào cho nước là thực thể đầu tiên của thế giới và quan điểm đó thuộc lập trường triết học nào?
a. Talét – Chủ nghĩa duy vật tự phát.
b. Điđrô – Chủ nghĩa duy vật biện chứng.
c. Béccơli – Chủ nghĩa duy tâm chủ quan.
d. Platôn – Chủ nghĩa duy tâm khách quan.
Nhà triết học nào coi lửa là thực thể đầu tiên của thế giới và đó là lập trường triết học nào?
a. Đêmôcrit – Chủ nghĩa duy vật tự phát.
b. Hêraclít – Chủ nghĩa duy vật tự phát.
c. Platôn – Chủ nghĩa duy tâm khách quan.
d. Anaximen – Chủ nghĩa duy vật tự phát.
Nhà triết học nào cho nguyên tử và khoảng không là thực thể đầu tiên của thế giới và đó là lập trường triết học nào?
a. Đêmôcrit – Chủ nghĩa duy vật tự phát.
b. Hêraclít –Chủ nghĩa duy vật tự phát.
c. Platôn – Chủ nghĩa duy tâm khách quan.
d. Arixtốt – Chủ nghĩa duy vật tự phát.
Đồng nhất vật chất nói chung với nguyên tử – một phần tử vật chất nhỏ nhất, đó là quan điểm của trường phái triết học nào?
a. Chủ nghĩa duy vật siêu hình thế kỷ XVII – XVIII.
b. Chủ nghĩa duy vật tự phát.
c. Chủ nghĩa duy vật biện chứng.
d. Chủ nghĩa duy tâm.
Đặc điểm chung của quan niệm duy vật về vật chất ở thời kỳ cổ đại là gì?
a. Đồng nhất vật chất nói chung với nguyên tử.
b. Đồng nhất vật chất nói chung với một dạng cụ thể hữu hình, cảm tính của vật chất.
c. Đồng nhất vật chất với khối lượng.
d. Đồng nhất vật chất với ý thức.
Thế nào là phương pháp siêu hình?
A. Xem xét sự vật trong trạng thái cô lập, tách rời tuyệt đối
B. Xem xét sự vật trong trạng thái tĩnh, không vận động phát triển
C. Xem xét sự phát triển chỉ là sự tăng tiến thuần tuý về lượng, không có thay đổi về chất
D. Tất cả các đáp án.
Thế giới quan khoa học dựa trên lập trường triết học nào?
A. Chủ nghĩa duy tâm chủ quan.
B. Chủ nghĩa duy tâm khách quan.
C. Chủ nghĩa duy vật.
D. Tất cả đều đúng.
Phát minh khoa học nào sau đây không phải là tiền đề khoa học tự nhiên của sự ra đời chủ nghĩa Mác?
A. Quy luật bảo toàn và chuyển hoá năng lượng.
B. Thuyết tiến hoá của Dacuyn.
C. Nguyên tử luận.
D. Học thuyết tế bào.
Ba phát minh trong khoa học tự nhiên: định luật bảo toàn và chuyển hoá năng lượng, học thuyết tế bào, học thuyết tiến hoá chứng minh thế giới vật chất có tính chất gì?
A. Tính tách rời của thế giới vật chất.
B. Tính biện chứng của sự vận động và phát triển của thế giới vật chất.
C. Tính không tồn tại thực của thế giới vật chất.
D. Tính tĩnh tại của thế giới vật chất.
Phép biện chứng cổ đại là:
A. Biện chứng duy tâm.
B. Biện chứng ngây thơ, chất phác.
C. Biện chứng duy vật khoa học.
D. Biện chứng chủ quan.


CHƯƠNG 2

Xác định câu trả lời thuộc chủ nghĩa duy tâm? Mâu thuẫn biện chứng là...?
A. Sự liên tác động lẫn nhau giữa các mặt, thuộc tính, có khuynh hướng biến đổi trái ngược nhau, tồn tại khách quan trong sự vật tạo thành mâu thuẫn biện chứng.
B. Là khuynh hướng biến đổi trái ngược nhau trong sự liên hệ tác động qua lại của các mặt do con người tạo ra.
C. Là sự tác động lẫn nhau của các mặt có sự khác nhau một cách khách quan, phổ biến giữa các sự vật hiện tượng.
D. Là sự liên hệ phổ biến của các mặt, các thuộc tính trong sự vật hiện tượng, trong sự thống nhất với nhau.
Hãy chỉ ra luận điểm thuộc lập trường duy vật siêu hình trong các luận điểm sau:
A. Mâu thuẫn là nguồn gốc, động lực của mọi sự vận động, phát triển
B. Phủ định của phủ định là sự loại bỏ hoàn toàn sự vật cũ
C. Nhân quả là mối liên hệ có tính chủ quan, do con người xác lập
D. Nhận thức chẳng qua chỉ là phức hợp các cảm giác của con người, do đó không có cảm giác không có nhận thức
Đồng nhất vật chất nói chung với một vật thể hữu hình, cảm tính đang tồn tại trong thế giới là quan điểm của trường phái triết học nào?
a.	Chủ nghĩa duy tâm
b.	Chủ nghĩa duy vật tự phát
c.	Chủ nghĩa duy vật siêu hình thế kỷ XVII – XVIII
d.	Chủ nghĩa duy vật biện chứng
Đồng nhất vật chất nói chung với nguyên tử là quan điểm của trường phái triết học nào?
a.	Chủ nghĩa duy tâm
b.	Chủ nghĩa duy vật tự phát
c.	Chủ nghĩa duy vật siêu hình thế kỷ XVII – XVIII
d.	Chủ nghĩa duy vật biện chứng
Hạn chế chung của quan niệm duy vật về vật chất ở thời kỳ cổ đại là?
a.	Mang tính duy tâm chủ quan
b.	Mang tính duy vật, tự phát, chất phác, ngây thơ
c.	Có tính duy vật máy móc, siêu hình 
d.	Mang tính duy tâm, thần bí
Mặt tích cực trong quan niệm duy vật về vật chất thời kỳ cổ đại?
a.	Chống quan niệm duy tâm, tôn giáo
b.	Thúc đẩy chủ nghĩa duy tâm khách quan phát triển
c.	Thúc đẩy chủ nghĩa duy tâm chủ quan phát triển
d.	Xây dựng niềm tin của con người vào Thượng đế
Đỉnh cao nhất của tư tưởng duy vật thời cổ đại về vật chất là?
a.	Quan niệm Âm dương, ngũ hành
b.	Quan niệm về lửa của Heraclit
c.	Quan niệm về nước của Talet
d.	Quan niệm về nguyên tử của Lơxip và Democrit
Quan điểm sau đây thuộc trường phái triết học nào: Cái gì mà con người cảm giác được là vật chất?
a.	Chủ nghĩa duy vật siêu hình
b.	Chủ nghĩa duy vật biện chứng
c.	Chủ nghĩa duy tâm khách quan
d.	Chủ nghĩa duy tâm chủ quan
Khi nói vật chất là cái được cảm giác của chúng ta chép lại, phản ánh lại, về mặt nhận thức luận, Lênin muốn khẳng định điều gì?
a.	Vật chất có trước, ý thức có sau
b.	Con người không đủ khả năng nhận thức thế giới
c.	Con người có khả năng nhận thức thế giới
d.	Nhận thức con người có giới hạn.
Đâu là quan niệm của chủ nghĩa duy vật biện chứng về phản ánh?
a.	Phản ánh là thuộc tính vốn có của mọi dạng vật chất
b.	Phản ánh là đặc tính riêng của một dạng vật chất có tổ chức cao nhất là bộ não con người
c.	Phản ánh là năng lực do Thượng đế ban cho
d.	Phản ánh không có thật, do con người tưởng tượng ra
Hai mệnh đề “Vận động là thuộc tính cố hữu của vật chất” và “Vận động là phương thức tồn tại của vật chất” được hiểu là:
A. Vật chất tồn tại bằng cách vận động.
B. Vật chất biểu hiện sự tồn tại cụ thể, đa dạng thông qua vận động.
C. Không thể có vận động phi vật chất cũng như không thể có vật chất không vận động.
D. Tất cả các đáp án.
Nguyên tắc phương pháp luận rút ra từ mối quan hệ giữa vật chất và ý thức theo quan điểm duy vật biện chứng là gì?
A. Nguyên tắc khách quan.
B. Nguyên tắc toàn diện.
C. Nguyên tắc lịch sử cụ thể.
D. Nguyên tắc phát triển.
Lựa chọn mệnh đề đúng trong số các mệnh đề được liệt kê dưới đây:
A. Trong một sự vật có thể tồn tại nhiều hình thức vận động.
B. Mỗi sự vật thường được đặc trưng bởi một hình thức vận động cao nhất mà nó có.
C. Hình thức vận động cao hơn có thể bao hàm trong nó những hình thức vận động thấp hơn.
D. Tất cả các đáp án
Tục ngữ Việt Nam có câu: “Cha mẹ sinh con, trời sinh tính”. Quan điểm trên thuộc lập trường triết học nào?
A. Chủ nghĩa duy vật.
B. Chủ nghĩa duy tâm khách quan.
C. Chủ nghĩa duy tâm chủ quan.
D. Tất cả các đáp án của câu này đều sai.
Chủ nghĩa duy vật bao gồm những hình thức nào?
A. Chủ nghĩa duy vật cổ đại.
B. Chủ nghĩa duy vật siêu hình.
C. Chủ nghĩa duy vật biện chứng.
D. Tất cả các đáp án trên.

Nhân tố cơ bản, trực tiếp tạo thành nguồn gốc xã hội của ý thức?
a.	Lao động và ngôn ngữ
b.	Lao động trí óc và lao động chân tay
c.	Lao động và nghiên cứu khoa học
d.	Lao động và thực tiễn
Quan điểm của triết học Mác-Lênin về bản chất của ý thức?
a.	Ý thức là sự phản ánh năng động, sáng tạo hiện thực khách quan
b.	Ý thức mang tính trực giác
c.	Ý thức phản ánh hiện thực khách quan một cách nguyên xi
d.	Ý thức của con người do Thượng đế ban cho
Đảng Cộng sản Việt Nam đã khẳng định: "Mọi chủ trương, đường lối của Đảng phải xuất phát từ thực tế, tôn trọng quy luật khách quan." Quan điểm này xuất phát từ?
a.	Nguyên lý về mối liên hệ phổ biến
b.	Nguyên lý về sự phát triển
c.	Mối quan hệ biện chứng giữa vật chất và ý thức
d.	Mối quan hệ biện chứng giữa cơ sở hạ tầng và kiến trúc thượng tầng
Hãy xác định câu trả lời đúng theo quan điểm Chủ nghĩa duy vật biên chứng về vai trò của Ý thức:
     a. Ý thức tự nó chỉ làm thay đổi tư tưởng. Như vậy ý thức hoàn toàn không có    tác dụng gì đối với thực tiễn.
b. Ý thức là phản ánh năng động, sáng tạo thực tại khách quan và đồng thời có tác động trở lại mạnh mẽ thực tại đó thông qua hoạt động thực tiễn của con người.
c. Ý thức là cái phụ thuộc vào nguồn gốc sinh ra nó. Vì thế chỉ có vật chất mới là cái năng động, tích cực.
d. Ý thức là cái quyết định vật chất . Vật chất chỉ là cái thụ động.

Trong nhận thức và hoạt động thực tiễn nếu tuyệt đối hóa vai trò của vật chất thì chủ thể sẽ mắc phải sai lầm nào?
a.	Chủ quan duy ý chí
b.	Nguỵ biện
c.	Giáo điều
d.	Phiến diện
Tính khách quan của mối liên hệ thể hiện như nào?
a.	Là mối liên hệ vốn có do Thượng đế sắp đặt
b.	Là mối liên hệ khách quan, vốn có của sự vật hiện tượng, tồn tại bên ngoài ý thức, cơ sở của nó là tính thống nhất vật chất của thế giới.
c.	Là mối liên hệ chủ quan, phụ thuộc vào ý thức con người
d.	Là mối liên hệ do cá nhân đặt ra
Từ nguyên lý về mối liên hệ phổ biến của phép biện chứng duy vật, rút ra được nguyên tắc phương pháp luận nào?
a.	quan điểm phát triển
b.	quan điểm lịch sử cụ thể
c.	quan điểm toàn diện
d.	quan điểm toàn diện, lịch sử cụ thể
Theo quan điểm của chủ nghĩa duy vật biện chứng, đáp án nào sai?
A. Phát triển là quá trình vận động từ thấp đến cao, từ kém hoàn thiện đến hoàn thiện hơn, từ chất cũ đến chất mới ở trình độ cao hơn.
B. Phát triển là sự tăng lên hoặc giảm đi về mặt lượng, chỉ là sự tuần hoàn, lặp đi, lặp lại mà không có sự thay đổi về chất.
C. Phát triển là vận động nhưng không phải mọi vận động đều là phát triển.
D. Đặc điểm chung của sự phát triển là tính tiến lên theo đường xoáy ốc, có kế thừa, có sự dường như lặp lại sự vật, hiện tượng cũ nhưng trên cơ sở cao hơn.
Định nghĩa về vật chất của Lênin được nêu trong tác phẩm nào?
a. Biện chứng của tự nhiên.
b. Chủ nghĩa duy vật và chủ nghĩa kinh nghiệm phê phán.
c. Bút ký triết học.
d. Nhà nước và cách mạng.
Định nghĩa vật chất của Lênin bao quát đặc tính quan trọng nhất của mọi dạng vật chất để phân biệt với ý thức, đó là đặc tính gì?
a. Thực tại khách quan độc lập với ý thức của con người.
b. Vận động.
c. Có khối lượng và quảng tính.
d. Tồn tại.
Định nghĩa vật chất của Lênin có ý nghĩa gì?
a. Khẳng định tính thứ nhất của vật chất.
b. Cho phép xác định vật chất trong lĩnh vực xã hội.
c. Chống lại chủ nghĩa duy tâm và thuyết không thể biết.
d. Tất cả các đáp án.
Theo Ăngghen, có thể chia vận động thành?
a. 4 hình thức vận động cơ bản.
b. 5 hình thức vận động cơ bản.
c. 6 hình thức vận động cơ bản.
d. 7 hình thức vận động cơ bản.
Nội dung của mối quan hệ biện chứng giữa vật chất và ý thức là?
a. Vật chất có trước, ý thức có sau, vật chất quyết định ý thức.
b. Vật chất có trước, ý thức có sau, vật chất quyết định ý thức, ý thức cũng có thể quyết định vật chất.
c. Vật chất có trước, ý thức có sau, vật chất quyết định ý thức, ý thức có thể tác động trở lại vật chất thông qua hoạt động thực tiễn của con người.
d. Vật chất và ý thức có vai trò như nhau.
Trường phái triết học nào cho rằng vận động bao gồm mọi sự biến đổi nói chung, là phương thức tồn tại của vật chất?
a. Chủ nghĩa duy vật siêu hình.
b. Chủ nghĩa duy vật biện chứng.
c. Chủ nghĩa duy tâm chủ quan.
d. Chủ nghĩa duy tâm khách quan.
Khi nói vật chất là cái được cảm giác của chúng ta chép lại, chụp lại, phản ánh lại, về mặt nhận thức luận, Lênin muốn khẳng định điều gì?
a. Cảm giác, ý thức của chúng ta là sự phản ánh thế giới khách quan.
b. Cảm giác, ý thức của chúng ta không thể phản ánh thế giới vật chất.
c. Cảm giác, ý thức phụ thuộc thụ động vào thế giới vật chất.
d. Cảm giác, ý thức là nguồn gốc của thế giới vật chất.
Theo chủ nghĩa duy vật biện chứng, ý thức là:
a. Hình ảnh chủ quan của thế giới khách quan.
b. Hình ảnh phản ánh sự vận động nói chung.
c. Một chức năng của bộ óc con người.
d. Sản phẩm của bộ óc, như gan tiết ra mật.
Theo chủ nghĩa duy vật biện chứng, nguồn gốc của vận động là:
a. Ở bên ngoài sự vật, hiện tượng do sự tương tác hay do sự tác động giữa các yếu tố khác nhau gây ra.
b. Ở trong bản thân sự vật hiện tượng do sự tác động của các mặt, các yếu tố trong sự vật hiện tượng gây ra.
c. Do ý thức quy định.
d. Do Thượng đế sinh ra.
Theo chủ nghĩa duy vật biện chứng, vật chất với tư cách là phạm trù triết học có đặc tính gì?
a. Vô hạn, vô tận, tồn tại vĩnh viễn, độc lập với ý thức.
b. Có giới hạn.
c. Tồn tại cảm tính.
d. Có sinh ra và mất đi.
Trong mối quan hệ giữa vận động và đứng im thì vận động là:
a. Tương đối.
b. Tuyệt đối.
c. Vĩnh viễn.
d. Tạm thời
Theo Ăngghen, hình thức vận động nào nói lên sự thay đổi vị trí của vật thể trong không gian?
a. Vận động cơ học.
b. Vận động vật lý.
c. Vận động hóa học.
d. Vận động sinh học.
Theo Ăngghen, hình thức vận động nào nói lên sự tương tác của các phân tử, các hạt cơ bản?
a. Vận động cơ học.
b. Vận động vật lý.
c. Vận động hóa học.
d. Vận động sinh học.
Theo Ăngghen, hình thức vận động nào nói lên sự trao đổi chất giữa cơ thể sống với môi trường?
a. Vận động cơ học.
b. Vận động vật lý.
c. Vận động hóa học.
d. Vận động sinh học.
Theo Ăngghen, hình thức vận động đặc trưng của con người và xã hội loài người là?
a. Vận động cơ học.
b. Vận động vật lý.
c. Vận động xã hội.
d. Vận động sinh học.
Hình thức vận động đa dạng, phức tạp nhất trong thế giới vật chất là?
a. Vận động xã hội.
b. Các phản ứng hạt nhân.
c. Sự tiến hóa các loài.
d. Vận động sinh học.
Theo chủ nghĩa duy vật biện chứng, vai trò của ý thức đối với vật chất là gì?
a. Ý thức sinh ra vật chất.
b. Ý thức và vật chất không có mối quan hệ với nhau.
c. Ý thức có vai trò quyết định đối với vật chất.
d. Ý thức có thể tác động trở lại vật chất thông qua hoạt động thực tiễn của con người.
Từ quan điểm của chủ nghĩa duy vật biện chứng về mối quan hệ giữa vật chất và ý thức, rút ra được nguyên tắc?
a. Phát huy tính năng động chủ quan.
b. Xuất phát từ thực tế khách quan.
c. Coi trọng yếu tố chủ quan.
d. Xuất phát từ thực tế khách quan, phát huy tính năng động chủ quan.
Bệnh chủ quan duy ý chí biểu hiện như thế nào?
a. Chỉ căn cứ vào kinh nghiệm lịch sử để định ra chiến lược và sách lược cách mạng.
b. Chỉ căn cứ vào quy luật khách quan để định ra chiến lược và sách lược cách mạng.
c. Chỉ căn cứ vào kinh nghiệm của các nước khác để định ra chiến lược và sách lược cách mạng.
d. Chỉ căn cứ vào mong muốn chủ quan để định ra chiến lược và sách lược cách
mạng.
“Mọi chủ trương, đường lối của Đảng phải xuất phát từ thực tế, tôn trọng quy luật khách quan”. Quan điểm này xuất phát từ:
a. Nguyên lý mối liên hệ phổ biến.
b. Nguyên lý về sự phát triển.
c. Mối quan hệ biện chứng giữa vật chất và ý thức.
d. Mối quan hệ biện chứng cơ sở hạ tầng quyết định ý thức xã hội.
Theo chủ nghĩa duy vật biện chứng, ý thức là:
a. Là hình ảnh của thế giới khách quan.
b. Là hình ảnh phản ánh sự vận động và phát triển của thế giới khách quan.
c. Là một phần chức năng của bộ óc con người.
d. Là sự phản ánh năng động, sáng tạo hiện thực khách quan của não bộ con người.
Sự khác nhau cơ bản giữa phản ánh ý thức với các hình thức phản ánh khác của thế giới vật chất là ở chỗ nào?
a. Tính thụ động trong quá trình phản ánh.
b. Tính định hướng, tích cực, sáng tạo.
c. Tính quy định bởi vật phản ánh.
d. Tất cả các đáp án.
Ăngghen viết: “[…] là điều kiện cơ bản đầu tiên của toàn bộ đời sống loài người, và như thế đến một mức mà trên một ý nghĩa nào đó, chúng chúng ta phải nói: […] đã sáng tạo ra bản thân con người”. Hãy điền một từ vào chỗ trống để hoàn thiện câu trên.
a. Lao động…lao động
b. Vật chất…vật chất
c. Tự nhiên…tự nhiên
d. Sản xuất…sản xuất
Theo cách phân chia các hình thức vận động của Ăngghen, hình thức vận động nào là thấp nhất?
a. Vận động cơ học.
b. Vận động vật lý.
c. Vận động hoá học.
d. Vận động xã hội.
Trường phái triết học nào cho vận động là tuyệt đối, đứng im là tương đối?
a. Chủ nghĩa duy vật tự phát.
b. Chủ nghĩa duy vật biện chứng.
c. Chủ nghĩa duy tâm khách quan.
d. Chủ nghĩa duy vật siêu hình thế kỷ XVII – XVIII.
Chủ nghĩa duy tâm tìm nguồn gốc của sự thống nhất của thế giới ở cái gì?
a. Ở tính vật chất của thế giới.
b. Ở ý niệm tuyệt đối hoặc ở ý thức của con người.
c. Ở sự vận động và chuyển hóa lẫn nhau của thế giới.
d. Ở vật chất.
Thuộc tính đặc trưng của vật chất theo chủ nghĩa Mác- Lênin là gì?
a. Là một phạm trù triết học.
b. Là tồn tại.
c. Là tất cả những gì bên ngoài con người.
d. Là thực tại khách quan tồn tại bên ngoài, không lệ thuộc vào cảm giác.
Theo chủ nghĩa duy vật biện chứng, đứng im là?
a. Biểu hiện của trạng thái không phát triển.
b. Biểu hiện của trạng thái vận động trong thăng bằng.
c. Biểu hiện của trạng thái không vận động.
Theo chủ nghĩa duy vật biện chứng, ý thức tác động trở lại vật chất thông qua?
a. Sự phê phán.
b. Hoạt động thực tiễn.
c. Hiện thực.
d. Hoàn cảnh.
Quan điểm của chủ nghĩa duy tâm về nguồn gốc của ý thức?
a. Là sự phản ánh của hiện thực khách quan.
b. Là thuộc tính của bộ não người, do não người tiết ra.
c. Phủ nhận nguồn gốc vật chất của ý thức.
d. Ý thức tồn tại vĩnh biễn.
Theo chủ nghĩa duy vật biện chứng, nguồn gốc tự nhiên của ý thức gồm những yếu tố nào?
a. Bộ óc con người.
b. Bộ óc con người và thế giới bên ngoài tác động vào bộ óc con người.
c. Lao động của con người.
d. Tất cả các đáp án
Nguồn gốc xã hội của ý thức là yếu tố nào?
a. Bộ óc con người.
b. Sự tác động của thế giới bên ngoài vào bộ óc con người.
c. Lao động và ngôn ngữ của con người.
d. Lao động và phản ánh.
Theo Mác, yếu tố đầu tiên đảm bảo cho sự tồn tại của con người là gì?
a. Làm khoa học.
b. Sáng tạo nghệ thuật.
c. Lao động.
d. Hoạt động chính trị- xã hội.
Theo chủ nghĩa duy vật biện chứng, quá trình hình thành ý thức là quá trình nào?
a. Quá trình dạy và học
b. Quá trình nghiên cứu và sáng tạo thuần túy trong tư duy con người
c. Quá trình kinh tế
d. Quá trình phản ánh sáng tạo và cải tạo thế giới
Để phản ánh hiện thực khách quan, con người cần có cái gì?
a. Công cụ lao động.
b. Cơ quan cảm giác.
c. Ngôn ngữ.
d. Công cụ sản xuất.
Theo chủ nghĩa duy vật biện chứng, nguồn gốc trực tiếp và quan trọng nhất quyết định sự ra đời và phát triển của ý thức là gì?
a. Sự tác động của tự nhiên vào bộ óc con người.
b. Lao động, thực tiễn xã hội.
c. Bộ não người và hoạt động của nó.
d. Công cụ lao động.
Đâu là quan điểm của chủ nghĩa duy vật biện chứng về bản chất của ý thức?
a. Ý thức là thực thể độc lập với vật chất.
b. Ý thức là sự phản ánh nguyên xi hiện thực khách quan vào bộ óc con người.
c. Ý thức là sự phản ánh sáng tạo hiện thực khách quan vào bộ óc con người.
d. Ý thức là sản phẩm của mọi dạng vật chất.
Quan niệm của chủ nghĩa duy vật biện chứng về tính sáng tạo của ý thức là thế nào?
a. Ý thức tạo ra vật chất.
b. Ý thức tạo ra sự vật trong hiện thực.
c. Ý thức không sinh, không diệt.
d. Ý thức tạo ra hình ảnh mới về sự vật trong tư duy.
Theo chủ nghĩa duy vật biện chứng, trong kết cấu của ý thức thì yếu tố nào là cơ bản và cốt lõi nhất?
a. Tri thức.
b. Tình cảm.
c. Niềm tin.
d. Ý chí.
Theo chủ nghĩa duy vật biện chứng, kết cấu theo chiều dọc của ý thức gồm những yếu tố nào?
a. Tự ý thức; tiềm thức; vô thức
b. Tri thức; niềm tin; ý chí
c. Tự ý thức; tiềm thức; vô thức; trí tuệ nhân tạo
d. Ý thức; tự ý thức
Đâu là quan điểm của chủ nghĩa duy vật biện chứng về mối quan hệ giữa vật chất và ý thức?
a. Ý thức do vật chất quyết định
b. Ý thức tác động đến vật chất
c. Ý thức quyết định vật chất và vật chất tác động lại ý thức
d. Ý thức do vật chất quyết định, nhưng có tính độc lập tương đối và tác động trở lại vật chất thông qua hoạt động thực tiễn
Thế giới vô cơ, thế giới sinh vật và xã hội loài người là 3 lĩnh vực hoàn toàn khác biệt nhau, không quan hệ gì với nhau là quan điểm?
a. Duy vật siêu hình.
b. Duy vật biện chứng.
c. Duy tâm khách quan.
d. Duy tâm chủ quan.
Ăngghen viết: “…đã sáng tạo ra bản thân con người”. Hãy chọn từ thích hợp điền vào dấu … để hoàn thiện câu trên?
a. Vật chất.
b. Tự nhiên.
c. Lao động.
d. Ý thức.
Quan điểm “Tính năng động chủ quan của ý thức con người muốn phát huy có hiệu quả bao giờ cũng phải dựa trên cơ sở vật chất” thuộc lập trường triết học nào dưới đây:
A. Chủ nghĩa Duy vật biện chứng.
B. Chủ nghĩa Duy vật siêu hình.
C. Chủ nghĩa Duy tâm chủ quan.
D. Nhị nguyên luận.
Quan điểm “Mọi tri thức, dù trực tiếp hay gián tiếp, dù ở trình độ cao hay thấp, xét đến cùng đều dựa trên cơ sở thực tiễn” thuộc lập trường triết học nào:
A. Chủ nghĩa Duy vật biện chứng.
B. Chủ nghĩa Duy vật siêu hình.
C. Nhị nguyên luận.
D. Chủ nghĩa Duy tâm chủ quan.

Phép biện chứng duy vật có mấy nguyên lý cơ bản?
a. Một nguyên lý.
b. Hai nguyên lý.
c. Ba nguyên lý.
d. Bốn nguyên lý.
Nguyên lý cơ bản của phép biện chứng duy vật là nguyên lý nào?
a. Nguyên lý về sự tồn tại khách quan của vật chất và Nguyên lý về sự tồn tại chủ quan của ý thức.
b. Nguyên lý về sự vận động và Nguyên lý về sự đứng im.
c. Nguyên lý về mối liên hệ phổ biến và Nguyên lý về sự phát triển.
d. Nguyên lý về tính khách quan của thế giới vật chất và Nguyên lý về tính chủ quan của tinh thần.
Cơ sở lý luận của quan điểm (nguyên tắc) toàn diện là nguyên lý nào?
a. Nguyên lý về sự phát triển.
b. Nguyên lý về mối liên hệ phổ biến.
c. Nguyên lý về sự tồn tại khách quan của thế giới vật chất
d. Nguyên lý về tính đa dạng, phong phú của thế giới vật chất
Xem xét sự vật theo quan điểm (nguyên tắc) toàn diện yêu cầu chúng ta phải như thế nào?
a. Chỉ xem xét mối liên hệ cơ bản và tất yếu trong quá trình tồn tại và phát triển của sự vật.
b. Chỉ xem xét các mối liên hệ cơ bản trong quá trình tồn tại và phát triển của sự vật.
c. Phải xem xét tất cả các mối liên hệ trong quá trình tồn tại và phát triển của sự vật.
d. Phải xem xét tất cả các mối liên hệ đồng thời phân loại và thấy được vị trí, vai trò của các mối liên hệ.
Lựa chọn phương án đúng nhất?
a. Mối liên hệ chỉ diễn ra giữa các sự vật hiện tượng với nhau, còn trong bản thân sự vật hiện tượng không có sự liên hệ.
b. Mối liên hệ của sự vật hiện tượng chỉ do ý chí con người tạo ra, còn bản thân sự vật hiện tượng không có sự liên hệ.
c. Mối liên hệ của sự vật hiện tượng không chỉ diễn ra giữa các sự vật hiện tượng mà còn diễn ra ngay trong sự vật hiện tượng.
d. Mối liên hệ của sự vật hiện tượng là do lực lượng siêu nhiên quy định.
Trong lý luận về mâu thuẫn, quá trình đồng hóa và dị hóa trong cơ thể sống được gọi là gì?
a. Những thuộc tính.
b. Hai thuộc tính.
c. Hai mặt đối lập.
d. Hai yếu tố.
Trong hoạt động thực tiễn, sai lầm của sự chủ quan nóng vội là do không tôn trọng quy luật nào?
a. Quy luật thống nhất và đấu tranh của các mặt đối lập.
b. Quy luật từ những thay đổi về lượng dẫn đến những thay đổi về chất và ngược lại.
c. Quy luật phủ định của phủ định.
d. Quy luật về mối quan hệ biện chứng giữa cơ sở hạ tầng và kiến trúc thượng tầng.
Xác định quan niệm sai về phủ định biện chứng:
a. Phủ định có tính kế thừa.
b. Phủ định có nghĩa là chấm dứt sự phát triển.
c. Phủ định có tính phổ biến.
d. Phủ định có tính khách quan.
Ý nghĩa rút ra khi nghiên cứu quy luật thống nhất và đấu tranh của các mặt đối lập. Xác định đáp án sai.
a. Mâu thuẫn là khách quan, khi nghiên cứu sự vật hiện tượng phải nghiên cứu về mâu thuẫn của nó.
b. Sự vật khác nhau, mâu thuẫn khác nhau, nên phải có biện pháp phù hợp để giải quyết từng mâu thuẫn.
c. Phải giải quyết mâu thuẫn bằng phương pháp đấu tranh chứ không dung hòa.
d. Mâu thuẫn phụ thuộc vào cảm nhận của con người nên phải tìm cách nhận thức nó.
Đâu là quan điểm siêu hình về sự phát triển?
a. Chất của sự vật không thay đổi trong quá trình vận động và phát triển của chúng.
b. Phát triển là sự chuyển hoá từ những thay đổi về lượng thành sự thay đổi về chất.
c. Phát triển bao hàm sự nảy sinh chất mới và sự phủ định chất cũ.
d. Chất của sự vật chỉ thay đổi khi lượng thay đổi đến một giới hạn nhất định.
Trong xã hội, sự phát triển biểu hiện ra như thế nào?
a. Sự xuất hiện các hợp chất mới.
b. Sự xuất hiện các giống loài động vật, thực vật mới thích ứng tốt hơn với môi trường.
c. Sự thay thế chế độ xã hội này bằng một chế độ xã hội khác có trình độ cao hơn.
d. Sự thay thế cấu trúc xã hội.
Theo chủ nghĩa duy vật biện chứng, những tính chất nào sau đây là tính chất của sự phát triển?
a. Tính khách quan.
b. Tính phổ biến.
c. Tính đa dạng, phong phú.
d. Tất cả các đáp án
Trong nhận thức, cần quán triệt quan điểm phát triển. Điều đó dựa trên cơ sở lý luận của nguyên lý nào?
a. Nguyên lý về mối quan hệ phổ biến.
b. Nguyên lý về sự phát triển.
c. Nguyên lý về tính thống nhất vật chất của thế giới.
d. Nguyên lý về sự nhận thức.
Đâu là quan điểm của chủ nghĩa duy vật biện chứng về mối quan hệ giữa cái chung và cái riêng?
a. Cái chung tồn tại khách quan, bên ngoài cái riêng.
b. Cái riêng tồn tại khách quan không bao hàm cái chung.
c. Cái chung và cái riêng không tồn tại đồng thời.
d. Không có cái chung thuần tuý tồn tại ngoài cái riêng, cái chung tồn tại thông qua cái riêng.
Đâu là quan điểm của chủ nghĩa duy vật biện chứng về mối quan hệ giữa nhân – quả?
a. Một nguyên nhân có thể sinh ra nhiều kết quả.
b. Một nguyên nhân nhất định trong điều kiện nhất định chỉ sinh ra một kết quả.
c. Một nguyên nhân, trong nhưng điều kiện khác nhau thì sinh ra các kết quả khác nhau.
d. Một kết quả chỉ có thể do một nguyên nhân sinh ra.
Trong các luận điểm sau, đâu là quan điểm của chủ nghĩa duy vật biện chứng về mối quan hệ giữa nội dung và hình thức?
a. Nội dung quyết định hình thức trong sự phát triển của sự vật.
b. Hình thức quyết định nội dung trong sự phát triển của sự vật.
c. Hình thức và nội dung có tính độc lập với nhau.
d. Nội dung và hình thức đều giữ vai trò như nhau.
Đâu là quan điểm của chủ nghĩa duy vật biện chứng về mối quan hệ giữa bản chất – hiện tượng?
a. Bản chất và hiện tượng độc lập với nhau.
b. Bản chất nào hiện tượng ấy, bản chất đồng nhất với hiện tượng.
c. Bản chất nào hiện tượng ấy, bản chất thay đổi thì hiện tượng cũng thay đổi theo.
d. Bản chất là bất biến, hiện tượng thay đổi thường xuyên.
Đâu là quan điểm của chủ nghĩa duy vật biện chứng về mối quan hệ giữa khả năng – hiện thực?
a. Trong hoạt động thực tiễn, phải dựa vào khả năng.
b. Trong hoạt động thực tiễn, phải dựa vào hiện thực, không cần tính đến khả năng.
c. Trong hoạt động thực tiễn phải dựa vào hiện thực, đồng thời phải tính đến khả
năng.
d. Trong hoạt động thực tiễn, phải dựa vào hiện thực.
Theo chủ nghĩa duy vật biện chứng, luận điểm nào sau đây là sai?
a. Chất là tính quy định vốn có của sự vật.
b. Chất là tổng hợp hữu cơ các thuộc tính của sự vật nói lên sự vật là cái gì.
c. Chất của sự vật đồng nhất với thuộc tính của nó.
d. Chất là cái để phân biệt sự vật hiện tượng này với sự vật hiện tượng khác.
Theo chủ nghĩa duy vật biện chứng, luận điểm nào sau đây là sai?
a. Chất tồn tại khách quan bên ngoài sự vật.
b. Chất tồn tại khách quan gắn liền với sự vật.
c. Không có chất thuần tuý bên ngoài sự vật.
d. Chất là cái vốn có của sự vật.
Theo chủ nghĩa duy vật biện chứng,  luận điểm nào sau đây là sai?
a. Lượng là tính quy định vốn có của sự vật.
b. Lượng nói lên quy mô, trình độ phát triển của sự vật.
c. Lượng của sự vật phụ thuộc vào ý chí của con người.
d. Lượng tồn tại khách quan gắn liền với sự vật.
Theo chủ nghĩa duy vật biện chứng, Độ là?
a. Độ là phạm trù chỉ sự biến đổi về lượng và chất của sự vật hiện tượng.
b. Độ là phạm trù chỉ sự biến đổi về chất của sự vật hiện tượng.
c. Độ là phạm trù chỉ giới hạn biến đổi của lượng mà chưa làm thay đổi về chất của sự vật hiện tượng.
d. Độ là phạm trù chỉ sự biến đổi về lượng, tới điểm nút của sự vật hiện tượng.
Giới hạn từ 0 C đến 100 C được gọi là gì trong quy luật lượng- chất?
a. Độ.
b. Chất.
c. Lượng.
d. Bước nhảy.
Khi nước chuyển từ trạng thái lỏng sang trạng thái khí tại 100 độ C thì được gọi là gì trong quy luật lượng- chất?
a. Độ.
b. Bước nhảy.
c. Chuyển hoá về lượng.
d. Bay hơi
Tính quy định nói lên quy mô, trình độ phát triển của sự vật được gọi là gì?
a. Chất.
b. Lượng.
c. Độ.
d. Điểm nút.
Theo chủ nghĩa duy vật biện chứng,  luận điểm nào sau đây là sai?
a. Trong giới hạn của độ, sự thay đổi của lượng chưa làm cho chất của sự vật biến đổi.
b. Trong giới hạn của độ, sự thay đổi của lượng đều đưa đến sự thay đổi về chất của sự vật.
c. Chỉ khi lượng đạt đến giới hạn của độ (điểm nút) mới làm cho chất của sự vật thay đổi.
d. Khi bước nhảy được thực hiện thì sự vật chuyển hoá
Theo chủ nghĩa duy vật biện chứng, luận điểm nào sau đây là đúng?
a. Sự biến đổi về chất là kết quả sự biến đổi về lượng của sự vật.
b. Không phải sự biến đổi về chất nào cũng là kết quả của sự biến đổi về lượng.
c. Chất không có tác động gì đến sự thay đổi của lượng.
d. Chất biến đổi trước khi có sự biến đổi của lượng.
Theo chủ nghĩa duy vật biện chứng, luận điểm nào sau đây là đúng?
a. Quá trình phát triển của sự vật là quá trình thay đổi về lượng.
b. Quá trình phát triển của sự vật là quá trình thay đổi về chất.
c. Quá trình phát triển của sự vật là quá trình chuyển hoá từ sự thay đổi về lượng sang sự thay đổi về chất và ngược lại.
d. Quá trình phát triển của sự vật là quá trình biến đổi đồng thời của lượng và chất.
Trong hoạt động thực tiễn, sai lầm của trì trệ bảo thủ là do không tôn trọng quy luật nào của phép biện chứng duy vật?
a. Quy luật Lượng- chất.
b. Quy luật Phủ định của phủ định.
c. Quy luật Mâu thuẫn.
d. Quy luật vận động
Cơ sở lý luận của quan điểm toàn diện là gì?
a. Nguyên lý về sự phát triển.
b. Nguyên lý về mối liên hệ phổ biến.
c. Quy luật về sự đấu tranh của các mặt đối lập.
d. Quy luật phủ định của phủ định.
Nguyên lý về sự phát triển yêu cầu phải tuân thủ nguyên tắc gì trong hoạt động nhận thức và thực tiễn?
a. Lịch sử.
b. Phát triển.
c. Toàn diện.
d. Khách quan.
Quy luật nào vạch ra nguồn gốc, động lực của sự vận động, phát triển?
a. Quy luật thống nhất và đấu tranh của các mặt đối lập.
b. Quy luật từ những thay đổi dần về lượng dẫn đến sự thay đổi về chất và ngược lại.
c. Quy luật phủ định của phủ định.
d. Quy luật về mối qua hệ biện chứng giữa cơ sở hạ tầng và kiến trúc thượng tầng.
Quy luật nào vạch ra cách thức (phương thức) vận động, phát triển của sự vật?
a. Quy luật từ những thay đổi dần vê lượng dẫn đến sự thay đổi về chất và ngược lại.
b. Quy luật thống nhất và đấu tranh của các mặt đối lập.
c. Quy luật phủ định của phủ định.
d. Quy luật về sự phù hợp của qua hệ sản xuất với trình độ phát triển của lực lượng sản xuất.
Câu ca dao: Một cây làm chẳng nên non
                      Ba cây chụm lại nên hòn núi cao,
Thể hiện nội dung quy luật nào của phép biện chứng duy vật
A. Quy luật mâu thuẫn
B. Quy luật phủ định của phủ định
C. Quy luật chuyển hoá từ những sự thay đổi về lượng dẫn đến sự thay đổi về chất và ngược lại.
D. Quy luật về mối quan hệ biện chứng giữa cơ sở hạ tầng và kiến trúc thượng tầng.
Trong lý luận về mâu thuẫn người ta gọi quá trình đồng hoá và dị hoá trong cơ thể sống là gì?
A. Hai yếu tố
B. Những sự vật
C. Những thuộc tính
D. Hai mặt đối lập.
Tổng hợp nhưng thuộc tính khách quan vốn có của sự vật, nói lên sự vật là cái gì, phân biệt nó với cái khác. Đó là khái niệm nào?
a. Lượng.
b. chất.
c. Độ.
d. Điểm nút.
Khái niệm nào nói lên con số các thuộc tính cấu thành của sự vật hiện tượng?
a. Chất.
b. Bước nhảy.
c. Lượng.
d. Điểm nút.
Sự thống nhất giữa chất và lượng được thể hiện trong phạm trù nào?
a. Phạm trù độ.
b. Phạm trù lượng.
c. Phạm trù điểm nút.
d. Phạm trù bước nhảy.
Những điểm giới hạn mà tại đó sự thay đổi về lượng sẽ làm thay đổi về chất của sự vật được gọi là gì?
a. Bước nhảy.
b. Bước nhảy toàn bộ.
c. Điểm nút.
d. Bước nhảy dần dần.
Phạm trù triết học nào dùng để chỉ giai đoạn chuyển hoá về chất của sự vật do những thay đổi về lượng trước đó gây ra?
a. Độ.
b. Điểm nút.
c. Chất.
d. Bước nhảy.
Quy luật nào vạch ra khuynh hướng của sự vận động, phát triển?
a. Quy luật thống nhất và đấu tranh của các mặt đối lập.
b. Quy luật từ những thay đổi từ từ về lượng dẫn đến sự thay đổi về chất và ngược lại.
c. Quy luật phủ định của phủ định.
d. Quy luật về sự phù hợp của quan hệ sản xuất với trình độ phát triển của lực lượng sản xuất.
Quan niệm của chủ nghĩa Mác- Lênin về sự phát triển?
a. Là sự phủ định siêu hình.
b. Là sự phủ định biện chứng.
c. Là mọi sự biến đổi nói chung.
d. Là mọi sự phủ định.
Quy luật phủ định của phủ định vạch ra khuynh hướng của sự phát triển của sự vật hiện tượng như thế nào?
a. Theo đường thẳng.
b. Theo đường tròn.
c. Theo đường xoáy ốc đi lên.
d. Theo đường gập gềnh.
Quy luật từ những thay đổi từ từ về lượng dẫn đến sự thay đổi về chất và ngược lại?
a. Giải thích cách thức (phương thức) biến đổi của sự vật hiện tượng.
b. Giải thích khuynh hướng phát triển của sự vật hiện tượng.
c. Giải thích nguồn gốc sự phát triển của các sự vật hiện tượng.
d. Giải thích sự mâu thuẫn và thống nhất của các mặt đối lập
Theo chủ nghĩa duy vật biện chứng, luận điểm nào sau đây là sai?
a. Mặt đối lập là những mặt có đặc điểm trái ngược nhau.
b. Mặt đối lập tồn tại khách quan trong các sự vật.
c. Mặt đối lập không nhất thiết phải gắn liền với sự vật.
d. Mặt đối lập là vốn có của sự vật, hiện tượng.
Hai mặt đối lập ràng buộc nhau, tạo tiền đề tồn tại cho nhau, triết học Mác- Lênin gọi là gì?
a. Sự đấu tranh của hai mặt đối lập.
b. Sự thống nhất của hai mặt đối lập.
c. Sự chuyển hoá của hai mặt đối lập.
d. Sự tương đồng của các mặt đối lập.
Theo chủ nghĩa duy vật biện chứng, sự thống nhất của các mặt đối lập có những biểu hiện gì?
a. Sự cùng tồn tại, nương tựa nhau và làm tiền đề tồn tại của nhau.
b. Sự đồng nhất, có những điểm chung giữa hai mặt đối lập.
c. Sự bài trừ phủ định nhau.
d. Đấu tranh tuyệt đối với nhau.
Sự tác động theo xu hướng nào thì được gọi là sự đấu tranh của các mặt đối lập?
a. Ràng buộc nhau.
b. Nương tựa nhau.
c. Đan xen nhau.
d. Phủ định, bài trừ nhau.
Trong mâu thuẫn biện chứng, các mặt đối lập quan hệ với nhau như thế nào?
a. Thống nhất với nhau.
b. Đấu tranh với nhau.
c. Bình đẳng với nhau.
d. Vừa thống nhất, vừa đấu tranh với nhau.
Trong hai xu hướng tác động của các mặt đối lập, xu hướng nào quy định sự biến đổi thường xuyên của sự vật?
a. Thống nhất của các mặt đối lập.
b. Đấu tranh của các mặt đối lập.
c. Không có xu hướng nào.
d. Nương tựa vào nhau của các mặt đối lập.
Mâu thuẫn quy định bản chất của sự vật, thay đổi cùng với sự thay đổi căn bản về chất của sự vật, được gọi là mâu thuẫn gì?
a. Mâu thuẫn chủ yếu.
b. Mâu thuẫn bên trong.
c. Mâu thuẫn cơ bản.
d. Mâu thuẫn đối kháng.
Mâu thuẫn đối kháng tồn tại ở đâu?
a. Trong cả tự nhiên, xã hội và tư duy.
b. Trong mọi xã hội.
c. Trong xã hội có giai cấp đối kháng.
d. Trong tự nhiên.
Mâu thuẫn nổi lên hàng đầu trong mỗi giai đoạn của quá trình phát triển của sự vật hiện tượng được gọi là gì?
a. Mâu thuẫn bên trong.
b. Mâu thuẫn bên ngoài.
c. Mâu thuẫn chủ yếu.
d. Mâu thuẫn cơ bản.
Theo chủ nghĩa duy vật biện chứng, luận điểm nào sau đây là sai?
a. Phủ định biện chứng có tính khách quan.
b. Phủ định biện chứng là kết quả của sự kế thừa và phát triển
c. Phủ định biện chứng phụ thuộc vào ý thức của con người.
d. Phủ định biện chứng có tính phổ biến.
Theo chủ nghĩa duy vật biện chứng, luận điểm nào sau đây là sai?
a. Phủ định biện chứng xoá bỏ hoàn toàn cái cũ.
b. Phủ định biện chứng không đơn giản là xoá bỏ cái cũ.
c. Phủ định biện chứng loại bỏ những yếu tố không thích hợp của cái cũ.
d. Phủ định biện chứng giữ lại và cải biến những yếu tố còn thích hợp của cái cũ.
Theo chủ nghĩa Mác- Lênin, sự tự phủ định để đưa sự vật dường như quay lại điểm xuất phát ban đầu được gọi là gì?
a. Phủ định thông thường.
b. Phủ định của phủ định.
c. Chuyển hoá.
d. Sự lặp lại.
Con đường phát triển của sự vật hiện tượng mà quy luật phủ định của phủ định vạch ra là con đường nào?
a. Đường thẳng đi lên.
b. Đường tròn khép kín.
c. Đường xoáy ốc đi lên.
d. Đường cong.
Vị trí của quy luật phủ định của phủ định trong phép biện chứng duy vật?
a. Chỉ ra nguồn gốc của sự phát triển.
b. Chỉ ra cách thức của sự phát triển.
c. Chỉ ra khuynh hướng của sự phát triển.
d. Chỉ ra mâu thuẫn giữa các mặt trong sự vật.
Tính thống nhất vật chất của thế giới là cơ sở của mối liên hệ giữa các sự vật, hiện tượng. Đây là quan điểm của?
a. Chủ nghĩa duy tâm khách quan.
b. Chủ nghĩa duy tâm chủ quan.
c. Chủ nghĩa duy vật siêu hình.
d. Chủ nghĩa duy vật biện chứng
Quan điểm nào cho rằng sự phát triển chỉ là sự tăng, giảm đơn thuần về mặt lượng, không có sự thay đổi về chất?
a. Quan điểm siêu hình.
b. Quan điểm biện chứng.
c. Quan điểm duy tâm.
d. Quan điểm duy lý.
Theo chủ nghĩa duy vật biện chứng, phát triển là quá trình?
a. Tiến lên theo đường tròn khép kín.
b. Tiến lên theo đường quanh co, phức tạp, hình xoáy ốc đi lên.
c. Tiến lên theo đường thẳng tắp.
d. Tiến lên tuần tự.
Sự vât mới ra đời bao giờ cũng trên cơ sở những cái đã có của sự vật cũ, qua đó tiến hành chọn lọc những cái tích cực, tiến bộ, phù hợp để tiếp tục phát triển. Điều này thể hiện tính chất gì của sự phát triển?
a. Tính khách quan.
b. Tính phổ biến.
c. Tính đa dạng, phong phú.
d. Tính kế thừa.
Quan điểm nào góp phần khắc phục tư tưởng bảo thủ, trì trệ, định kiến trong hoạt động nhận thức và hoạt động thực tiễn?
a. Quan điểm lịch sử cụ thể.
b. Quan điểm toàn diện.
c. Quan điểm phát triển.
d. Quan điểm duy vật.
Quan điểm toàn diện, quan điểm lịch sử cụ thể và quan điểm phát triển được rút ra từ?
a. Mối quan hệ giữa vật chất và ý thức.
b. Hai nguyên lý cơ bản của phép biện chứng duy vật.
c. Mối quan hệ giữa nhận thức và thực tiễn.
d. Các quy luật cơ bản của phép biện chứng duy vật.
Theo quan điểm chủ nghĩa duy vật biện chứng, luận điểm nào sai?
A. Cái Chung chỉ tồn tại trong Cái Riêng, thông qua Cái Riêng mà biểu hiện sự tồn tại của mình.
B. Quan hệ giữa Cái Chung và Cái Riêng là quan hệ có tính chủ quan.
C. Quan hệ giữa Cái Chung và Cái Riêng là có tính phổ biến.
D. Cái Riêng là cái toàn bộ, phong phú hơn Cái chung, Cái chung là cái bộ phận, nhưng sâu sắc hơn Cái riêng.

Theo chủ nghĩa duy vật biện chứng?
a. Cái chung chỉ tồn tại trong cái riêng.
b. Cái riêng chỉ tồn tại trong cái chung.
c. Cái chung và cái riêng đều tồn tại trong nhau.
d. Cái chung và cái riêng đều tồn tại độc lập với nhau.
Theo chủ nghĩa duy vật biện chứng, cái tất nhiên là cái do?
a. Những nguyên nhân cơ bản bên trong sự vật quy định.
b. Những nguyên nhân cơ bản bên ngoài sự vật quy định.
c. Những nguyên nhân chủ quan.
d. Cả nguyên nhân bên trong và nguyên nhân bên ngoài sự vật quy định.
Phạm trù triết học nào dùng để chỉ tổng hợp tất cả những mặt, những yếu tố, những quá trình tạo nên sự vật?
a. Bản chất.
b. Nội dung.
c. Hiện thực.
d. Hình thức.
Khả năng được hình thành do quy luật vận động nội tại của sự vật quy định thì được gọi là?
a. Khả năng thực tế.
b. Khả năng tất nhiên.
c. Khả năng ngẫu nhiên.
d. Khả năng nội tại.
Tổng hợp tất cả những mặt, những mối liên hệ tất nhiên, tương đối ổn định bên trong sự vật, quy định sự vận động và phát triển của sự vật được gọi là?
a. Nội dung.
b. Bản chất.
c. Hình thức bên trong.
d. Hiện tượng.
Không có hình thức nào tồn tại thuần tuý không chứa nội dung và cũng không có nội dung nào lại không tồn tại trong những hình thức xác định. Quan điểm này thể hiện?
a. Vai trò quyết định của nội dung đối với hình thức.
b. Sự tác động trở lại của hình thức đối với nội dung.
c. Sự thống nhất giữa nội dung và hình thức.
d. Sự độc lập giữa nội dung và hình thức.
Quy luật được coi là hạt nhân của phép biện chứng duy vật là?
a. Quy luật thống nhất và đấu tranh của các mặt đối lập.
b. Quy luật từ những thay đổi về lượng dẫn đến những thay đổi về chất và ngược lại.
c. Quy luật phủ định của phủ định.
d. Quy luật lực lượng sản xuất và quan hệ sản xuất
Theo chủ nghĩa duy vật biện chứng, cách thức (phương thức) của sự phát triển là?
a. Đấu tranh của các mặt đối lập để giải quyết mâu thuẫn.
b. Sự thay đổi về lượng dẫn đến sự thay đổi về chất và ngược lại.
c. Quá trình phủ định cái cũ và sự ra đời của cái mới.
d. các câu trên đều sai.
Theo chủ nghĩa duy vật biện chứng, thống nhất của hai mặt đối lập là?
a. Sự bài trừ, gạt bỏ lẫn nhau giữa hai mặt đối lập.
b. Sự nương tựa lẫn nhau, tồn tại không tách rời nhau, mặt này lấy mặt kia làm tiền đề cho sự tồn tại của mình.
c. Hai mặt đối lập có tính chất, đặc điểm, khuynh hướng phát triển trái ngược nhau.
d. Quá trình cái mới ra đời thay thế cái cũ.
Theo chủ nghĩa duy vật biện chứng, đấu tranh của hai mặt đối lập là?
a. Sự tác động qua lại theo xu hướng bài trừ và phủ định lẫn nhau.
b. Sự hỗ trợ và nương tựa lẫn nhau.
c. Sự gắn bó lẫn nhau giữa hai mặt đối lập biện chứng.
d. Sự bổ sung lẫn nhau giữa hai mặt đối lập.
Theo chủ nghĩa duy vật biện chứng, phủ định biện chứng là?
a. Sự phủ định tự thân, tạo điều kiện cho sự ra đời của cái mới tiến bộ thay thế cái cũ.
b. Sự phủ định có sự tác động của sự vật khác.
c. Sự phủ định có sự tác động của sự vật khác để tạo điều kiện cho sự ra đời của cái mới tiến bộ thay thế cái cũ.
d. Phủ định sạch trơn.
Theo chủ nghĩa duy vật biện chứng, quy luật phủ định của phủ định làm rõ vấn đề gì?
a. Nguồn gốc của sự phát triển.
b. Khuynh hướng của sự vận động, phát triển.
c. Cách thức của sự phát triển.
d. Động lực của sự phát triển.
Theo chủ nghĩa duy vật biện chứng, mặt đối lập là?
a. Những mặt, yếu tố, thuộc tính, khuynh hướng trái ngược nhau, cấu tạo nên sự vật.
b. Những mặt khác nhau nằm ở hai sự vật.
c. Những mặt trái ngược nhau bất kỳ, như trắng với đen, cao với thấp...
d. Những mặt vừa giống nhau, vừa khác nhau.
Quan điểm ủng hộ cái mới tiến bộ, chống lại cái cũ, cái lỗi thời kìm hãm sự phát triển là quan điểm được rút ra trực tiếp từ?
a. Quy luật thống nhất và quy luật đấu tranh của các mặt đối lập.
b. Quy luật từ những thay đổi về lượng dẫn đến những thay đổi về chất và ngược lại.
c. Quy luật phủ định của phủ định.
d. Quy luật xã hội.
Tư tưởng nôn nóng, đốt cháy giai đoạn phản ánh trực tiếp việc?
a. Không vận dụng đúng quy luật thống nhất và đấu tranh của các mặt đối lập.
b. Không vận dụng đúng quy luật từ những thay đổi về lượng dẫn đến những thay đổi về chất và ngược lại.
c. Không vận dụng đúng quy luật phủ định của phủ định.
d. Không vận dụng đúng quy luật tự nhiên và quy luật xã hội.
Phạm trù triết học nào dùng để chỉ tính quy định khách quan vốn có của sự vật và hiện tượng, sự thống nhất hữu cơ của các thuộc tính làm cho nó là nó mà không phải là cái khác?
a. Chất.
b. Lượng.
c. Độ.
d. Bước nhảy.

Triết học Mác-Lênin cho rằng : Thực tiễn là toàn bộ … có mục đích, mang tính lịch sử, xã hội của con người nhằm cải tạo thế giới khách quan. Chọn từ đúng nhất để hoàn thiện quan điểm trên :
a. Hoạt động tinh thần
b. Hoạt động vật chất
c. Hoạt động vật chất và tinh thần
d. Hoạt động
Hình thức nào của tư duy trừu tượng là hình thức liên kết các khái niệm?
a. Khái niệm
b. Phán đoán
c. Suy lý
d. Trừu tượng
Hình thức nào dưới đây không nằm trong giai đoạn nhận thức lý tính?
a. Tri giác
b. Phán đoán
c. Suy lý
d. Khái niệm
Hình ảnh về sự vật được tái hiện trong đầu khi không còn tri giác trực tiếp sự vật được gọi là gì?
a. Biểu tượng
b. Phán đoán
c. Khái niệm
d. Suy lý
Trường phái triết học nào cho rằng thực tiễn là cơ sở chủ yếu và trực tiếp của nhận thức?
a. Chủ nghĩa duy tâm khách quan.
b. Chủ nghĩa duy vật siêu hình.
c. Chủ nghĩa duy vật biện chứng.
d. Chủ nghĩa duy lý.
Hoạt động nào sau đây không phải là hoạt động thực tiễn?
a. Hoạt động chính trị- xã hội
b. Hoạt động thực nghiệm khoa học
c. Hoạt động sản xuất vật chất
d. Hoạt động vui chơi giải trí
Câu thành ngữ “miệng nam mô, bụng bồ dao găm” phản ánh sự mâu thuẫn của cặp phạm trù nào?
a. Chung – riêng.
b. Bản chất – hiện tượng.
c. Nội dung – hình thức.
d. Nguyên nhân – kết quả.
Quan niệm: “Gieo nhân nào, gặt quả ấy” phản ánh mối quan hệ của cặp phạm trù nào?
a. Chung – riêng.
b. Bản chất – hiện tượng.
c. Nội dung – hình thức.
d. Nguyên nhân – kết quả.
Đâu là quan điểm của chủ nghĩa duy vật biện chứng về tiêu chuẩn chân lý?
a. Thực tiễn là tiêu chuẩn của chân lý có tính chất tương đối.
b. Thực tiễn là tiêu chuẩn của chân lý có tính chất tuyệt đối.
c. Thực tiễn là tiêu chuẩn của chân lý vừa có tính chất tương đối vừa có tính chất tuyệt đối.
d. Thực tiễn không phải là tiêu chuẩn của chân lý.
Thực tiễn là?
a. Hoạt động vật chất có mục đích mang tính lịch sử - xã hội của con người.
b. Hoạt động tinh thần nhằm tạo ra các giá trị thẫm mỹ.
c. Bao gồm cả hoạt động vật chất và hoạt động tinh thần.
d. Hoạt động sản xuất vật chất.
Hình thức cơ bản nhất của thực tiễn là?
a. Hoạt động chính trị - xã hội.
b. Hoạt động sản xuất vật chất.
c. Thực nghiệm khoa học.
d. Các phương án trên đều đúng.
Ba loại hoạt động thực tiễn cơ bản của con người là?
a. Hoạt động sản xuất vật chất, chính trị xã hội, thực nghiệm khoa học.
b. Hoạt động sản xuất xã hội, chính trị xã hội, thực nghiệm khoa học.
c. Hoạt động sản xuất tinh thần, chính trị xã hội, thực nghiệm khoa học.
d. Hoạt động sản xuất tinh thần, hoạt động tư duy, hoạt động sáng tạo
Theo chủ nghĩa duy vật biện chứng, quá trình nhận thức đi từ:
a. Tư duy trừu tượng đến trực quan sinh động và từ tư duy trừu tượng đến thực tiễn
b. Trực quan sinh động đến tư duy trừu tượng và từ tư duy trừu tượng đến thực tiễn
c. Trực quan sinh động đến tư duy trừu tượng và từ trực quan sinh động đến thực tiễn
d. Trực quan sinh động đến chân lý.
Theo chủ nghĩa duy vật biện chứng, hình thức cao nhất của nhận thức cảm tính là?
a. Tri giác.
b. Biểu tượng.
c. Cảm giác.
d. Khái niệm.
Theo chủ nghĩa duy vật biện chứng, hình thức cao nhất của nhận thức lý tính là?
a. Phán đoán.
b. Suy lý.
c. Khái niệm.
d. Biểu tượng.
Theo chủ nghĩa duy vật biện chứng, cơ sở, động lực, mục đích của nhận thức là?
a. Hoạt động lý luận.
b. Thực tiễn.
c. Hoạt động văn hoá nghệ thuật.
d. Kinh tế.
Giai đoạn mà con người sử dụng các giác quan để tác động trực tiếp vào các sự vật nhằm nắm bắt các sự vật ấy được gọi là?
a. Nhận thức thông thường.
b. Nhận thức lý tính.
c. Nhận thức cảm tính.
d. Nhận thức gián tiếp.
Theo chủ nghĩa duy vật biện chứng, chân lý là gì?
a. Những quan điểm lý luận thuộc về số đông.
b. Những quan điểm lý luận có lợi cho mọi người.
c. Sự phù hợp giữa tri thức với hiện thực khách quan và được thực tiễn kiểm nghiệm.
d. Ý kiến của những người có uy tín trong xã hội.
Theo chủ nghĩa duy vật biện chứng, chân lý có những tính chất gì?
a. Tính khách quan, tính tương đối, tính hoàn chỉnh.
b. Tính khách quan, tính tuyệt đối, tính tương đối, tính cụ thể.
c. Tính khách quan, tính tuyệt đối, tính phổ biến.
d. Tính đa dạng, phong phú.
Theo chủ nghĩa duy vật biện chứng, nhận thức lý tính được thực hiện thông qua nhưng hình thức cơ bản nào?
a. Cảm giác – Tri giác – Biểu tượng.
b. Cảm giác – Phán đoán – Tri giác.
c. Khái niệm – Phán đoán – Suy lý.
d. Khái niệm – Suy lý – Tri giác.
Theo quan điểm của chủ nghĩa duy vật biện chứng, luận điểm nào sau đây là sai?
A. Thực tiễn không có lý luận là thực tiễn mù quáng
B. Lý luận không có thực tiễn là lý luận suông
C. Lý luận có thể phát triển không cần thực tiễn
D. Lý luận luôn gắn liền với thực tiễn.
Quan điểm “Học đi đôi với hành” phản ánh quan điểm nào của chủ nghĩa duy vật biện chứng?
A. Mỗi quan hệ giữa vật chất và ý thức.
B. Mỗi quan hệ giữa cái chung – cái riêng.
C. Mỗi quan hệ giữa cơ sở hạ tầng và kiến trức hạ tầng.
D. Mối quan hệ giữa lý luận và thực tiễn.
Theo quan điểm của chủ nghĩa duy vật biện chứng luận điểm nào sau đây là sai?
A. Nhận thức lý tính phản ánh những mối liên hệ chung, bản chất của sự vật.
B. Nhận thức lý tính phản ánh sự vật sâu sắc, đầy đủ và chính xác hơn nhận thức cảm tính.
C. Nhận thức lý tính luôn đạt đến chân lý không mắc sai lầm.
D. Nhận thức lý tính dựa trên cơ sở của nhận thức cảm tính.
Trong hoạt động thực tiễn không coi trọng lý luận thì sẽ thế nào?
A. Sẽ rơi vào chủ nghĩa kinh viện giáo điều
B. Sẽ rơi vào chủ nghĩa kinh nghiệm hẹp hòi.
C. Sẽ rơi vào ảo tưởng.
D. Rơi vào chủ nghĩa chiết trung.
Tìm nhận định sai về giai đoạn nhận thức trực quan sinh động trong các câu sau?
A. Giai đoạn nhận thức trực quan sinh động là giai đoạn đầu tiên của quá trình nhận thức.
B. Giai đoạn nhận thức trực quan sinh động là giai đoạn phản ánh trực tiếp khách thể bằng các khái niệm.
C. Giai đoạn nhận thức trực quan sinh động là giai đoạn nhận thức đối tượng bằng các hình thức: cảm giác, tri giác, biểu tượng.
D. Giai đoạn nhận thức trực quan sinh động là giai đoạn chưa nhận thức được bản chất, quy luật của sự vật.
Tìm nhận định sai về tư duy trừu tượng trong các câu sau:
A. Giai đoạn nhận thức tiếp theo giai đoạn trực quan sinh động.
B. Giai đoạn nhận thức cao hơn dựa trên cơ sở những tài liệu do trực quan sinh động đem lại.
C. Giai đoạn phản ánh gián tiếp hiện thực nên có nguy cơ phản ánh sai lệch hiện thực.
D. Giai đoạn nhận thức bằng cảm giác, tri giác và suy luận.
Xác định quan niệm sai về thực tiễn?
A. Thực tiễn là mục đích của nhận thức.
B. Thực tiễn là kết quả của nhận thức.
C. Thực tiễn là cơ sở, là động lực của nhận thức.
D. Thực tiễn là tiêu chuẩn của chân lý.
Chân lý có tính chất gì, xác định câu trả lời đúng?
A. Chân lý có tính cụ thể, có nội dung khách quan, vừa có tính tuơng đối, vừa có tính tương đối
B. Không có chân lý trừu tượng, chân lý có hình thức chủ quan, nội dung khách quan, không có tính tương đối vì chân lý luôn luôn đúng trong mọi hoàn cảnh
C. Chân lý có nội dung khách quan,hình thức chủ quan, chân lý có tình trừu tượng cao siêu, chân lí còn có tính tuyệt đối và tính tương đối
D. Chân lý có hình thưc chủ quan và nội dung khách quan, chân lý bao giờ cũng cụ thể, chỉ có chân lý tương đối, không có chân lý tuyệt đối vì thực tế luôn luôn biến đổi và nhận thức con người là có hạn
Phát hiện đáp án sai về nhận thức trong các đáp án sau:
A. Nhận thức là quá trình phản ánh hiện thực khách quan, là quá trình tạo thành tri thức về thế giới khách quan trong bộ óc con người
B. Nhận thức là quá trình tác động biện chứng giữa chủ thể nhận thức và khách thể nhận thức trên cơ sở hoạt động thực tiễn của con người.
C. Nhận thức là quá trình phản ánh hiện thực khách quan một cách tích cực, chủ động, sáng tạo bởi con người trên cơ sở thực tiễn mang tính lịch sử cụ thể.
D. Nhận thức là quá trình phản ánh hiện thực khách quan một cách thụ động của con người trên cơ sở thực tiễn mang tính lịch sử cụ thể.
Quan điểm “Không có lý luận thì hoạt động thực tiễn của con người mò mẫm mất phương hướng. Lý luận không phục vụ cho thực tiễn, trở thành lý luận suông, giáo điều” thuộc lập trường triết học nào dưới đây:
A. Chủ nghĩa Duy vật biện chứng.
B. Chủ nghĩa Duy vật siêu hình.
C. Nhị nguyên luận.
D. Chủ nghĩa Duy tâm khách quan.


CHƯƠNG 3

Theo quan điểm của chủ nghĩa duy vật lịch sử, con người có các quá trình sản xuất xã hội cơ bản nào?
a. Sản xuất vật chất.
b. Sản xuất tinh thần.
c. Sản xuất ra bản thân con người.
d. Tất cả các đáp án.
Trong các quá trình sản xuất chủ yếu của xã hội, quá trình nào là cơ sở của sự tồn tại và phát triển xã hội?
a. Sản xuất vật chất.
b. Sản xuất tinh thần.
c. Sản xuất ra bản thân con người.
d. Tất cả các đáp án.
Theo quan điểm của chủ nghĩa duy vật lịch sử, quy luật cơ bản của sự vận động và phát triển xã hội là gì?
a. Quy luật về sự phù hợp của quan hệ sản xuất với tính chất và trình độ phát triển của lực lượng sản xuất.
b. Quy luật về mối quan hệ giữa cơ sở hạ tầng và kiến trúc thượng tầng.
c. Quy luật chuyển hoá từ sự thay đổi về lượng dẫn đến sự thay đổi về chất và ngược lại.
d. Quy luật đấu tranh giai cấp
Sản xuất ra của cải vật chất là?
a. Hoạt động đặc trưng của con người và xã hội loài người.
b. Hoạt động của loài vật.
c. Hoạt động của loài người và của loài vật.
d. Hoạt động của muôn loài
Trình độ của lực lượng sản xuất thể hiện ở?
a. Trình độ của người lao động, trình độ của công cụ lao động.
b. Trình độ tổ chức lao động xã hội, trình độ tổ chức lao động xã hội.
c. Trình độ ứng dụng khoa học vào sản xuất, trình độ phân công lao động xã hội.
d. Trình độ của quan hệ sản xuất.
Nội dung của quy luật về sự phù hợp của quan hệ sản xuất với tính chất và trình độ phát triển của lực lượng sản xuất?
a. Lực lượng sản xuất quyết định sự hình thành, biến đổi và phát triển của quan hệ sản xuất.
b. Quan hệ sản xuất quyết định sự hình thành, biến đổi và phát triển của lực lượng sản xuất.
c. Sự tác động trở lại của quan hệ sản xuất đối với lực lượng sản xuất.
d. Lực lượng sản xuất quyết định sự hình thành, biến đổi của quan hệ sản xuất ; quan hệ sản xuất tác động trở lại lực lượng sản xuất.
Sự chuyển biến của xã hội loài người qua các giai đoạn lịch sử khác nhau được quyết định bởi?
a. Phương thức sản xuất.
b. Lực lượng sản xuất.
c. Quan hệ sản xuất.
d. Cơ sở hạ tầng.
Theo quan điểm của chủ nghĩa duy vật lịch sử, xã hội loài người là một dạng phát triển đặc biệt của yếu tố nào?
a.  Thế giới siêu nhiên
b. Thế giới tinh thần.
c. Thế giới vật chất.
d. Cộng đồng người nguyên thủy
Lao động của con người là hoạt động mang tính chất gì?
a. Tính cá nhân.
b. Tính xã hội.
c. Dân chủ.
d. Tự do.
Khi nền sản xuất được thực hiện với những công cụ ở trình độ thủ công, đơn giản thì lực lượng sản xuất mang tính?
a. Tính xã hội.
b. Cá nhân.
c. Tính quần chúng.
d. Tính lạc hậu.
Quan điểm đổi mới của Đảng ta hiện nay?
a. Chỉ đổi mới đất nước trên lĩnh vực kinh tế.
b. Chỉ đổi mới đất nước trên lĩnh vực chính trị.
c. Đổi mới dần dần.
d. Kết hợp đổi mới kinh tế với đổi mới chính trị.
Theo quan điểm của chủ nghĩa duy vật lịch sử, muốn thay đổi một chế độ xã hội thì phải làm gì?
a. Thay đổi lực lượng sản xuất.
b. Tạo ra nhiều của cải.
c. Thay đổi quan hệ sản xuất.
d. Thay đổi lực lượng sản xuất và quan hệ sản xuất.
Chọn phương án đúng theo quan điểm của chủ nghĩa duy vật lịch sử?
a. Tồn tại xã hội có trước, ý thức xã hội có sau, tồn tại xã hội quyết định ý thức xã hội.
b. Tồn tại xã hội có trước, ý thức xã hội có sau, tồn tại xã hội quyết định ý thức xã hội nhưng ý thức xã hội có sự tác động trở lại tồn tại xã hội.
c. Tồn tại xã hội và ý thức xã hội ra đời đồng thời nhưng tồn tại xã hội quyết định ý thức xã hội, ý thức xã hội có sự tác động trở lại tồn tại xã hội.
d. Ý thức xã hội có trước, quyết định tồn tại xã hội.
Theo quan điểm của chủ nghĩa duy vật lịch sử, mâu thuẫn giữa giai cấp vô sản và giai cấp tư sản được gọi là?
a. Mâu thuẫn đối kháng.
b. Mâu thuẫn không đối kháng
c. Mâu thuẫn cơ bản.
d. Mâu thuẫn chủ yếu.
Luận điểm “Những thời đại kinh tế khác nhau không phải ở chỗ chúng sản xuất ra cái gì, mà là ở chỗ chúng sản xuất bằng cách nào, với những tư liệu lao động nào” thuộc lập trường triết học nào dưới đây:
A. Chủ nghĩa Duy vật lịch sử.
B. Chủ nghĩa Duy vật tầm thường.
C. Thuyết không thể biết.
D. Chủ nghĩa Duy tâm lịch sử.
Quan điểm “Ý thức xã hội là cái phản ánh tồn tại xã hội, vì vậy nó không có vai trò gì đối với tồn tại xã hội” biểu hiện lập trường triết học nào dưới đây:
A. Nhị nguyên luận.
B. Chủ nghĩa Duy vật lịch sử.
C. Chủ nghĩa Duy vật siêu hình.
D. Chủ nghĩa Duy tâm lịch sử.

Theo quan điểm của chủ nghĩa duy vật lịch sử, phương thức sản xuất bao gồm những yếu tố nào cấu thành?
a. Lực lượng sản xuất và quan hệ sản xuất.
b. Lực lượng sản xuất, quan hệ sản xuất, cơ sở hạ tầng.
c. lực lượng sản xuất, quan hệ sản xuất, cơ sở hạ tầng, kiến trúc thượng tầng.
d. Lực lượng sản xuất, cơ sở hạ tầng, quan hệ sản xuất.
Yếu tố giữ vai trò quyết định trong lực lượng sản xuất là?
a. Công cụ lao động.
b. Người lao động.
c. Đối tượng lao động.
d. Tư liệu lao động.
Quan hệ sản xuất là quan hệ giữa người với người trong quá trình sản xuất vật chất, đây là quan hệ?
a. Tồn tại chủ quan, bị quy định bởi chế độ kinh tế.
b. Tồn tại chủ quan, bị quy định bởi chế độ chính trị xã hội.
c. Tồn tại khách quan, bị quy định bởi chế độ văn hoá.
d. Tồn tại khách quan, quyết định mọi quan hệ xã hội
Quan hệ giữ vai trò quyết định đối với những quan hệ khác trong quan hệ giữa người với người của quá trình sản xuất là?
a. Quan hệ phân phối sản phẩm lao động.
b. Quan hệ sở hữu tư liệu sản xuất.
c. Quan hệ tổ chức, quản lý quá trình sản xuất.
d. Quan hệ cạnh tranh.
Theo quan điểm của chủ nghĩa duy vật lịch sử, cơ sở hạ tầng của một hình thái kinh tế - xã hội là?
a. Toàn bộ những quan hệ sản xuất tạo thành cơ cấu kinh tế của một hình thái kinh tế - xã hội nhất định.
b. Toàn bộ những điều kiện vật chât, những phương tiện vật chất tạo thành cơ sở vật chất – kỹ thuật của xã hội.
c. Toàn bộ những điều kiện vật chất, những phương tiện vật chất và những con người sử dụng nó để tiến hành các hoạt động xã hội.
d. Toàn bộ những vấn đề về chính trị trong đời sống xã hội.
Theo quan điểm của chủ nghĩa duy vật lịch sử, sự phát triển của các hình thái kinh tế- xã hội là?
a. Quá trình lịch sử- tự nhiên.
b. Quá trình lịch sử theo ý chí của giai cấp cầm quyền.
c. Quá trình lịch sử theo ý chí của đảng cầm quyền.
d. Quá trình phát triển của sản xuất hàng hoá.
Theo quan điểm của chủ nghĩa duy vật lịch sử, nguyên nhân sâu xa của việc ra đời của giai cấp thuộc?
a. Lĩnh vực chính trị.
b. Lĩnh vực kinh tế.
c. Lĩnh vực tôn giáo.
d. Lĩnh vực văn hoá.

Theo quan điểm của chủ nghĩa duy vật lịch sử, tồn tại xã hội bao gồm những nhân tố nào?
a. Điều kiện tự nhiên.
b. Dân số, mật độ dân cư.
c. Phương thức sản xuất.
d. Tất cả các yếu tố trên.
Yếu tố nào có vai trò quan trọng nhất đối với sự phát triển của tồn tại xã hội?
a. Điều kiện tự nhiên.
b. Phương thức sản xuất.
c. Dân số, mật độ dân cư.
d. Quan hệ sản xuất.
Theo quan điểm của chủ nghĩa duy vật lịch sử, cấu trúc cơ bản của một hình thái kinh tế- xã hội là gì?
a. Lực lượng sản xuất và quan hệ sản xuất.
b. Cơ sở kinh tế và thể chế nhà nước.
c. Lực lượng sản xuất, quan hệ sản xuất và kiến trúc thượng tầng.
d. Lực lượng sản xuất, quan hệ sản xuất và cơ sơ hạ tầng, kiến trúc thượng tầng,
Cấu trúc của một hình thái kinh tế- xã hội gồm các yếu tố nào hợp thành?
a. Lực lượng sản xuất, quan hệ sản xuất và kiến trúc thượng tầng.
b. Lực lượng sản xuất và quan hệ sản xuất.
c. Quan hệ sản xuất và kiến trúc thượng tầng.
d. Cơ sở hạ tầng và kiến trúc thượng tầng.
Điểm xuất phát để nghiên cứu xã hội và lịch sử của C.Mác, Ph.Ăngghen  là:
A. Con người hiện thực
B. Sản xuất vật chất
C. Các quan hệ xã hội
D. Đời sống xã hội
Bản chất của con người được quyết định bởi:
A. Các mối quan hệ xã hội
B. Nỗ lực của mỗi cá nhân
C. Giáo dục của gia đình và nhà trường
D. Đời sống kinh tế
Lực lượng quyết định sự phát triển của lịch sử là:
A. Nhân dân
B. Quần chúng nhân dân
C. Vĩ nhân, lãnh tụ
D. Các nhà khoa học
Sự phân chia giai cấp trong xã hội bắt đầu từ hình thái kinh tế – xã hội nào?
A. Cộng sản nguyên thuỷ
B. Chiếm hữu nô lệ
C. Phong kiến.
D. Tư bản chủ nghĩa
Nguyên nhân trực tiếp của sự ra đời giai cấp trong xã hội?
A. Do sự phát triển lực lượng sản xuất làm xuất hiện “của dư” tương đối
B. Do sự chênh lệch về khả năng giữa các tập đoàn người
C. Do sự xuất hiện chế độ tư hữu về tư liệu sản xuất
D. Do sự phân hoá giữa giàu và nghèo trong xã hội
Đấu tranh giai cấp, xét đến cùng là nhằm:
A. Phát triển sản xuất
B. Giải quyết mâu thuẫn giai cấp
C. Lật đổ sự áp bức của giai cấp thống trị bóc lột.
D. Giành lấy chính quyền Nhà nước
Mâu thuẫn đối kháng giữa các giai cấp là do:
A. Sự khác nhau về tư tưởng, lối sống
B. Sự đối lập về lợi ích cơ bản – lợi ích kinh tế
C. Sự khác nhau giữa giàu và nghèo
D. Sự khác nhau về mức thu nhập
Vai trò của đấu tranh giai cấp trong lịch sử nhân loại?
A. Là động lực cơ bản của sự phát triển xã hội.
B. Là một động lực quan trọng của sự phát triển xã hội trong các xã hội có giai cấp
C. Thay thế các hình thái kinh tế – xã hội từ thấp đến cao.
D. Lật đổ ách thống trị của giai cấp thống trị
Trình độ của lực lượng sản xuất thể hiện ở:
A. Trình độ công cụ lao động và người lao động
B. Trình độ tổ chức, phân công lao động xã hội
C. Trình độ ứng dụng khoa học vào sản xuất
D. Tất cả các đáp án.
Tiêu chuẩn khách quan để phân biệt các chế độ xã hội trong lịch sử?
A. Quan hệ sản xuất đặc trưng
B. Chính trị tư tưởng
C. Lực lượng sản xuất
D. Phương thức sản xuất
Yếu tố cách mạng nhất trong lực lượng sản xuất?
A. Người lao động
B. Công cụ lao động
C. Phương tiện lao động
D. Tư liệu lao động
Trong quan hệ sản xuất, quan hệ nào giữ vai trò quyết định?
A. Quan hệ sở hữu tư liệu sản xuất
B. Quan hệ tổ chức, quản lý quá trình sản xuất
C. Quan hệ phân phối sản phẩm.
D. Quan hệ sở hữu tư nhân về tư liệu sản xuất
Thời đại đồ đồng tương ứng với hình thái kinh tế – xã hội?
A. Hình thái kinh tế – xã hội cộng sản nguyên thuỷ
B. Hình thái kinh tế – xã hội phong kiến
C. Hình thái kinh tế – xã hội chiếm hữu nô lệ
D. Hình thái kinh tế – xã hội tư bản chủ nghĩa
Thực chất của quan hệ biện chứng giữa cơ sở hạ tầng và kiến trúc thượng tầng?
A. Quan hệ giữa đời sống vật chất và đời sống tinh thần của xã hội
B. Quan hệ giữa lĩnh vực kinh tế và lĩnh vực chính trị
C. Quan hệ giữa nhà nước và đảng phái
D. Quan hệ giữa giai cấp thống trị với giai cấp bị trị
C.Mác viết: “Tôi coi sự phát triển của những hình thái kinh tế – xã hội là một quá trình lịch sử – tự nhiên”, theo nghĩa:
A. Sự phát triển của các hình thái kinh tế – xã hội cũng giống như sự phát triển của tự nhiên không phụ thuộc chủ quan của con người.
B. Sự phát triển của các hình thái kinh tế – xã hội tuân theo quy luật khách quan của xã hội.
C. Sự phát triển của các hình thái kinh tế – xã hội ngoài tuân theo các quy luật chung còn bị chi phối bởi điều kiện lịch sử cụ thể của mỗi quốc gia dân tộc.
D. Tất cả cấc đáp án trên.
Những đặc trưng cơ bản của nhà nước:
A. Nhà nước quản lý dân cư trên một vùng lãnh thổ nhất định
B. Là bộ máy quyền lực đặc biệt mang tính cưỡng chế đối với mọi thành viên trong xã hội
C. Nhà nước hình thành hệ thống thuế khoá để duy trì và tăng cường bộ máy cai trị
D. Tất cả các đáp án 
Thực chất của cách mạng xã hội là:
A. Thay đổi thể chế chính trị này bằng thể chế chính trị khác
B. Thay đổi thể chế kinh tế này bằng thể chế kinh tế khác
C. Thay đổi hình thái kinh tế – xã hội thấp lên hình thái kinh tế – xã hội cao hơn.
D. Thay đổi chế độ xã hội
Hãy xác định đáp án đúng về cấu trúc của cơ sở hạ tầng trong các đáp án sau:
A. Bao gồm quan hệ sản xuất thống trị, quan hệ sản xuất tàn dư, quan hệ sản xuất mầm mống. Trong đó quan hệ sản xuất thống trị là đặc trưng cho cơ sở hạ tầng của xã hội đó.
B. Bao gồm quan hệ sản xuất thống trị, quan hệ sản xuất tàn dư, quan hệ sản xuất mầm mống. Trong đó quan hệ sản xuất mầm mống đặc trưng cho cơ sở hạ tầng của xã hội đó.
C. Bao gồm lực lượng sản xuất, quan hệ sản xuất và hoàn cảnh địa lý tự nhiên
D. Bao gồm hệ thống điện, đường, trường, trạm
Luận điểm: «Cơ sở kinh tế thay đổi thì toàn bộ cái kiến trúc thượng tầng đồ sộ cũng bị đảo lộn ít nhiều nhanh chóng" thuộc lập trường triết học nào?
A. Chủ nghĩa duy vật lịch sử
B. Chủ nghĩa duy vật tầm thường
C. Chủ nghĩa duy tâm lịch sử
D. Chủ nghĩa duy tâm chủ quan
Xác định lập trường duy vật lịch sử về mối quan hệ giữa cơ sở hạ tầng và kiến trúc thượng tầng trong các đáp án sau:
A. Quy luật về mối quan hệ biện chứng giữa cơ sở hạ tầng và kiến trúc thượng tầng là cơ sở khoa học cho việc nhận thức một cách đúng đắn mối quan hệ giữa văn hóa và xã hội.
B. Quy luật về mối quan hệ biện chứng giữa cơ sở hạ tầng và kiến trúc thượng tầng là cơ sở khoa học cho việc nhận thức một cách đúng đắn mối quan hệ giữa kinh tế và chính trị.
C. Quy luật về mối quan hệ biện chứng giữa cơ sở hạ tầng và kiến trúc thượng tầng là cơ sở khoa học cho việc nhận thức một cách đúng đắn mối quan hệ giữa tôn giáo và nghệ thuật.
D. Quy luật về mối quan hệ biện chứng giữa cơ sở hạ tầng và kiến trúc thượng tầng là cơ sở khoa học cho việc nhận thức một cách đúng đắn mối quan hệ giữa đạo đức và pháp quyền.
Phát hiện một câu trả lời sai về vai trò của cơ sở hạ tầng đối với kiến trúc thượng tầng:
A. Cơ sở hạ tầng nào thì sinh ra kiến trúc thượng tầng ấy
B. Những biến đổi căn bản trong cơ sở hạ tầng sớm hay muộn cũng sẽ dẫn tới sự biến đổi căn bản trong kiến trúc thượng tầng
C. Cũng có những yếu tố thuộc kiến trúc thượng tầng cũ tồn tại dai dẳng sau khi cơ sở kinh tế sinh ra nó không tồn tại
D. Cơ sở hạ tầng cũ mất đi thì kiến trúc thượng tầng tương ứng với nó sẽ mất theo ngay lập tức
Theo quan điểm của chủ nghĩa duy vật lịch sử, kiến trúc thượng tầng là?
a. Toàn bộ những quan điểm tư tưởng và những thiết chế tương ứng .
b. Toàn bộ những quan điểm chính trị, xã hội, pháp luật, đạo đức, tôn giáo.
c. Toàn bộ những thiết chế tương ứng: nhà nước, đảng phái, giáo hội, các tổ chức quần chúng.
d. Toàn bộ những quan điểm tư tưởng và những thiết chế tương ứng được hình thành trên một cơ sở hạ tầng nhất định.
Vì sao ý thức xã hội có sức mạnh cải tạo tồn tại xã hội?
a. Vì ý thức xã hội chỉ huy mọi hoạt động của xã hội.
b. Vì ý thức xã hội là sự phản ánh tồn tại xã hội một cách sinh động thông qua hoạt động thực tiễn của con người.
c. Vì ý thức xã hội thể hiện hiệu quả tích cực năng động qua các hoạt động của con người.
d. Vì ý thức khoa học phát triển mạnh, giữ vai trò lực lượng sản xuất trực tiếp trong nhiều ngành kinh tế.
Trong lực lượng sản xuất, yếu tố nào giữ vị trí quan trọng nhất
a. Con người.
b. Công cụ lao động.
c. Phương tiện lao động.
d. Các yếu tố trên có đều có vị trí quan trọng như nhau.
Luận điểm “Những thời đại kinh tế khác nhau không phải ở chỗ chúng sản xuất ra cái gì mà là ở chỗ chúng sản xuất bằng cách nào, với những tư liệu lao động nào” nhấn mạnh yếu tố nào trong các đáp án sau:
A. Công cụ lao động
B. Người lao động
C. Đối tượng lao động
D. Công cụ phụ trợ

Chính trị, pháp quyền, đạo đức là những yếu tố thuộc phạm trù nào sau đây?
a. Cơ sở hạ tầng.
b. Quan hệ sản xuất.
c. Kiến trúc thượng tầng.
d. Lực lượng sản xuất.
Giữa cơ sở hạ tầng và kiến trúc thượng tầng, yếu tố nào giữ vai trò quyết định?
a. Cơ sở hạ tầng.
b. Kiến trúc thượng tầng.
c. Không có cái nào quyết định.
d. Hai yếo tố có vai trò như nhau
Theo quan điểm của chủ nghĩa duy vật lịch sử, quy luật xã hội nào giữ vai trò quyết định sự vận động, phát triển của các chế độ xã hội?
a. Quy luật đấu tranh giai cấp.
b. Quy luật cơ sở hạ tầng quyết định kiến trúc thượng tầng.
c. Quy luật về sự phù hợp của quan hệ sản xuất với trình độ phát triển của lực lượng sản xuất.
d. Quy luật tồn tại xã hội quyết định ý thức xã hội.
Đường lối, quan điểm của Đảng là một bộ phận của:
a. Cơ sơ hạ tầng.
b. Lực lượng sản xuất.
c. Kiến trúc thượng tầng.
d. Quan hệ sản xuất.
Theo quan điểm của chủ nghĩa duy vật lịch sử, con người phát triển và hoàn thiện mình chủ yếu dựa vào yếu tố nào?
a. Phát triển kinh tế - xã hội.
b. Đấu tranh giai cấp.
c. Lao động sản xuất.
d. Tất cả đều sai.
Theo quan điểm của chủ nghĩa duy vật lịch sử, ý thức xã hội bao gồm những cấp độ nào?
a. Tâm lý xã hội và hệ tư tưởng.
b. Tình cảm xã hội và ý thức xã hội.
c. Nhận thức cá nhân và nhận thức xã hội.
d. Phản ánh cá nhân và phản ánh xã hội.
Chủ nghĩa duy vật lịch sử quan niệm về con người như thế nào?
a. Là thực thể tự nhiên.
b. Là thực thể xã hội.
c. Là chủ thể cải tạo hoàn cảnh.
d. Là sự thống nhất giữa thực thể tự nhiên và thực thể xã hội
Theo quan điểm của chủ nghĩa duy vật lịch sử, hình thức cao nhất của đấu tranh giai cấp là gì?
a. Đấu tranh chính trị.
b. Đấu tranh kinh tế.
c. Đấu tranh văn hóa- tư tưởng.
d. Đấu tranh cách mạng.
Trong các đặc trưng ở định nghĩa giai cấp của Lênin, đặc trưng nào là quyết định nhất?
a. Có địa vị khác nhau trong một hệ thống sản xuất nhất định trong lịch sử.
b. Có mối quan hệ khác nhau đối với tư liệu sản xuất.
c. Có vai trò khác nhau trong tổ chức lao động xã hội.
d. Có sự khác nhau về phương thức và quy mô hưởng thụ của cải xã hội.
Hình thức đấu tranh đầu tiên của giai cấp vô sản khi chưa có chính quyền là gì?
a. Đấu tranh tư tưởng.
b. Đấu tranh chính trị.
c. Đấu tranh kinh tế.
d. Đấu tranh vũ trang.
Theo quan điểm của chủ nghĩa duy vật lịch sử, loại mâu thuẫn nào thể hiện đặc trưng của quan hệ giai cấp?
a. Mâu thuẫn bên trong và mâu thuẫn bên ngoài 
b. Mâu thuẫn đối kháng và không đối kháng
c. Mâu thuẫn chủ yếu và mâu thuẫn thứ yếu
d. Mâu thuẫn cơ bản và mâu thuẫn không cơ bản
Ý thức xã hội là sự phản ánh tích cực xủa tồn tại xã hội. Luận điểm này thuộc lập trường triết học nào? Chọn câu trả lời đúng nhất:
A. Chủ nghĩa duy tâm khách quan
B. Chủ nghĩa duy tâm
C. Chủ nghĩa duy vật
D. Chủ nghĩa duy vật lịch sử
Phát hiện đáp án sai về con người theo quan điểm của chủ nghĩa Mác Lênin?
A. Con người là thực thể sinh học - xã hội
B. Con người là sản phẩm của lịch sử và của chính bản thân con người
C. Con người vừa là chủ thể của lịch sử, vừa là sản phẩm của lịch sử
D.  Con người là sản phẩm của thượng đế
Yếu tố đầu tiên đảm bảo cho sự tồn tại của con người là gì?
A. Làm khoa học.
B. Lao động.
C. Sáng tạo nghệ thuật.
D. Làm chính trị.
Ý thức xã hội thường lạc hậu hơn so với tồn tại xã hội vì?
A. Nó không phục thuộc vào tồn tại xã hội
B. Nó luôn đi sau, phụ thuộc hoàn toàn vào tồn tại xã hội
C. Ý thức xã hội là cái phản ánh tồn tại xã hội nên nó thay đổi chậm hơn 
D. Do sức mạnh siêu nhiên níu kéo, duy trì
`

function parseAndApplyText() {
    let currentQ = null;
    let parsedQs = [];

    const lines = rawQuestionText.split('\n');
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        if (line.match(/^(CHƯƠNG|PHẦN)/i)) continue;

        let optMatch = line.match(/^([a-d])[\.\)]\s*(.*)/i);
        
        // Sửa lỗi gõ thiếu dấu chấm ở option B
        if (!optMatch && line.toLowerCase().startsWith('b triết học')) {
            optMatch = ["", "B", "Triết học, Chính trị, Tôn giáo"];
        }

        if (optMatch) {
            let letter = optMatch[1].toUpperCase();
            if (!currentQ) {
                currentQ = { text: "", options: {} };
            }
            currentQ.options[letter] = optMatch[2];
        } else {
            // Không phải dòng option
            if (currentQ && Object.keys(currentQ.options).length > 0) {
                // Kiểm tra xem đây có phải là đoạn nối tiếp của option cuối cùng không (nếu nó viết thường ở đầu)
                let firstChar = line.charAt(0);
                let isLowerCase = (firstChar === firstChar.toLowerCase() && firstChar !== firstChar.toUpperCase());
                
                if (isLowerCase) {
                    let keys = Object.keys(currentQ.options);
                    let lastKey = keys[keys.length - 1];
                    currentQ.options[lastKey] += " " + line;
                } else {
                    // Dòng mới, chữ cái đầu in hoa -> Câu hỏi mới
                    parsedQs.push(currentQ);
                    currentQ = { text: line, options: {} };
                }
            } else {
                if (!currentQ) {
                    currentQ = { text: line, options: {} };
                } else {
                    currentQ.text += " " + line;
                }
            }
        }
    }
    if (currentQ) parsedQs.push(currentQ);

    // Xoá bỏ các tiền tố như "1)", "10a)" ở đầu câu hỏi
    parsedQs.forEach(q => {
        q.text = q.text.replace(/^(\d+[a-b]?[\)\.])\s*/, '');
    });

    // Map mảng các câu hỏi đã parse được vào defaultQuestions
    for (let i = 0; i < parsedQs.length; i++) {
        if (defaultQuestions[i]) {
            defaultQuestions[i].text = parsedQs[i].text;
            defaultQuestions[i].options = parsedQs[i].options;
        }
    }
    
    // Lọc bỏ những câu hỏi rỗng (không có lựa chọn đáp án) để tránh câu lỗi hiển thị
    defaultQuestions = defaultQuestions.filter(q => q.options && Object.keys(q.options).length > 0);
}

// Gọi hàm nạp ngay khi tải file data.js
parseAndApplyText();
