import type { QuickReply } from './claim-quick-replies'

/** Section label shown above the verification quick-reply chips. */
export const HANDOVER_VERIFICATION_SECTION = 'Yêu cầu xác minh'

/**
 * Composer hint shown when staff need a generic prompt to verify ownership
 * (used as a fallback when a subcategory has no tailored questions).
 */
export const HANDOVER_VERIFICATION_PLACEHOLDER =
  'Mô tả một chi tiết đặc trưng hoặc tải lên hình ảnh (như hóa đơn, hộp, hoặc ảnh cũ của quý khách với món đồ) để chứng minh quyền sở hữu.'

/** A single ownership-verification question staff can drop into the composer. */
interface VerificationQuestion {
  /** Short label shown on the chip. */
  label: string
  /** Full question inserted into the composer (staff can edit before sending). */
  text: string
}

/**
 * Ownership-verification questions, keyed by inventory subcategory `code`
 * (see `InventorySubcategory.code`). Each subcategory has a focused set that
 * leans on details only the real owner would know. Unknown codes fall back to
 * `others`.
 */
export const HANDOVER_VERIFICATION_QUESTIONS: Record<string, VerificationQuestion[]> = {
  // --- CARDS (tập trung vào dữ liệu in trên thẻ và dấu vết riêng) ---
  identification_card: [
    {
      label: 'Thông tin in trên thẻ',
      text: 'Họ tên đầy đủ, ngày sinh hoặc số CCCD/CMND in trên thẻ này là gì ạ?',
    },
    {
      label: 'Dấu hiệu riêng',
      text: 'Trên thẻ hoặc vỏ thẻ có vết xước, miếng dán hay dấu hiệu đặc biệt nào không ạ?',
    },
    {
      label: 'Giấy tờ đối chiếu',
      text: 'Quý khách vui lòng gửi ảnh một giấy tờ liên quan (như hóa đơn tiện ích hoặc cổng thông tin trường học) trùng tên với thẻ, nhớ che các thông tin nhạy cảm giúp em ạ.',
    },
  ],
  passport: [
    {
      label: 'Thông tin hộ chiếu',
      text: 'Số hộ chiếu, hoặc họ tên đầy đủ và quốc tịch in bên trong là gì ạ?',
    },
    {
      label: 'Dấu / sticker',
      text: 'Bên trong có con dấu thị thực gần đây hoặc sticker du lịch đặc biệt nào không ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh lịch trình chuyến đi, hóa đơn đặt vé hoặc e-visa trùng khớp với thông tin hộ chiếu giúp em ạ.',
    },
  ],
  driver_license: [
    {
      label: 'Số / hạng GPLX',
      text: 'Số giấy phép lái xe hoặc hạng xe được cấp trên giấy phép là gì ạ?',
    },
    {
      label: 'Địa chỉ trên GPLX',
      text: 'Địa chỉ thường trú in trên giấy phép lái xe là gì ạ?',
    },
    {
      label: 'Giấy tờ liên quan',
      text: 'Quý khách vui lòng gửi ảnh đăng ký xe, thẻ bảo hiểm hoặc giấy tờ liên quan có tên và địa chỉ của mình giúp em ạ.',
    },
  ],
  personal_card: [
    {
      label: 'Thương hiệu',
      text: 'Logo thương hiệu hoặc công ty trên thẻ này là gì ạ?',
    },
    {
      label: 'Tên / số thành viên',
      text: 'Tên hoặc số thành viên in/dập nổi trên thẻ là gì ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh hóa đơn, email thành viên hoặc hồ sơ trên ứng dụng liên quan đến thẻ này giúp em ạ.',
    },
  ],
  bank_card: [
    {
      label: '4 số cuối',
      text: '4 chữ số cuối in trên thẻ là gì ạ?',
    },
    {
      label: 'Ngân hàng & chủ thẻ',
      text: 'Thẻ do ngân hàng nào phát hành và mang tên ai ạ?',
    },
    {
      label: 'Sao kê / ảnh',
      text: 'Quý khách vui lòng gửi ảnh sao kê hoặc màn hình ngân hàng điện tử hiển thị 4 số cuối (che toàn bộ các số khác và số dư) giúp em ạ.',
    },
  ],
  student_card: [
    {
      label: 'Mã số SV',
      text: 'Mã số sinh viên in trên thẻ là gì ạ?',
    },
    {
      label: 'Phụ kiện thẻ',
      text: 'Trên thẻ có sticker, dây đeo hoặc bao đựng thẻ đặc biệt nào không ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh biên lai học phí, lịch học trên cổng thông tin trường, hoặc ảnh cũ có đeo thẻ giúp em ạ.',
    },
  ],
  company_card: [
    {
      label: 'Mã NV / phòng ban',
      text: 'Mã nhân viên hoặc phòng ban ghi trên thẻ là gì ạ?',
    },
    {
      label: 'Dây đeo thẻ',
      text: 'Dây đeo hoặc móc thẻ kèm theo có màu hoặc thương hiệu gì ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh phiếu lương (đã che thông tin), chữ ký email công ty, hoặc ảnh cũ tại văn phòng giúp em ạ.',
    },
  ],

  // --- ELECTRONICS (tập trung vào mật khẩu, số serial và vết trên vỏ) ---
  laptop: [
    {
      label: 'Màn hình khóa',
      text: 'Hình nền màn hình khóa, hoặc tên đăng nhập/mật khẩu của máy là gì ạ?',
    },
    {
      label: 'Dấu hiệu trên vỏ',
      text: 'Trên vỏ máy có vết móp, vết xước hoặc sticker đặc biệt nào không ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh hóa đơn mua hàng, hộp gốc có số serial, hoặc ảnh cũ đang sử dụng máy giúp em ạ.',
    },
  ],
  phone: [
    {
      label: 'Màn hình khóa',
      text: 'Hình nền màn hình khóa hoặc mật mã mở khóa của máy là gì ạ?',
    },
    {
      label: 'IMEI / Find My',
      text: 'Quý khách có thể cung cấp số IMEI hoặc kích hoạt âm thanh "Find My" để chứng minh quyền sở hữu không ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh hộp gốc có số IMEI, hóa đơn nhà mạng, hoặc ảnh cũ đang cầm thiết bị giúp em ạ.',
    },
  ],
  smartwatch: [
    {
      label: 'Mặt đồng hồ',
      text: 'Mặt đồng hồ đang hiển thị trên thiết bị là gì ạ?',
    },
    {
      label: 'Vết xước / dây đeo',
      text: 'Màn hình có vết xước rõ rệt hoặc dây đeo tùy chỉnh nào không ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh ứng dụng đã ghép nối trên điện thoại, hóa đơn mua hàng, hoặc hộp gốc giúp em ạ.',
    },
  ],
  charger_adapter: [
    {
      label: 'Hãng / công suất',
      text: 'Thương hiệu, công suất (W) và màu sắc của bộ sạc là gì ạ?',
    },
    {
      label: 'Số cổng / loại cổng',
      text: 'Bộ sạc có mấy cổng và thuộc loại nào ạ (ví dụ: hai cổng USB-C, một cổng USB-A)?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh thiết bị đi kèm bộ sạc cùng hóa đơn mua thiết bị đó giúp em ạ.',
    },
  ],
  mouse: [
    {
      label: 'Hãng / model',
      text: 'Thương hiệu, tên model và màu sắc của chuột là gì ạ?',
    },
    {
      label: 'Đặc điểm riêng',
      text: 'Chuột có vết mòn đặc trưng hoặc đầu thu USB đi kèm nào không ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh hóa đơn mua hàng, hộp gốc, hoặc ảnh cũ bàn làm việc giúp em ạ.',
    },
  ],
  keyboard: [
    {
      label: 'Hãng / model / switch',
      text: 'Thương hiệu, model và loại switch (nếu là bàn phím cơ) là gì ạ?',
    },
    {
      label: 'Đặc điểm riêng',
      text: 'Bàn phím có keycap tùy chỉnh, sticker đặc biệt hay phím nào bị thiếu không ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh hóa đơn mua hàng, hộp gốc, hoặc ảnh cũ bàn làm việc giúp em ạ.',
    },
  ],
  powerbank: [
    {
      label: 'Hãng / dung lượng',
      text: 'Thương hiệu, dung lượng (mAh) và màu sắc của sạc dự phòng là gì ạ?',
    },
    {
      label: 'Đặc điểm riêng',
      text: 'Sạc dự phòng có vết xước, sticker hoặc dây cáp đi kèm đặc biệt nào không ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh đơn đặt hàng, hóa đơn hoặc bao bì gốc giúp em ạ.',
    },
  ],
  power_outlet: [
    {
      label: 'Hãng / số ổ',
      text: 'Thương hiệu, màu sắc và số lượng ổ cắm là gì ạ?',
    },
    {
      label: 'Dấu hiệu riêng',
      text: 'Trên vỏ có dấu hiệu đặc biệt, băng dính hoặc hư hỏng cụ thể nào không ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh hóa đơn mua hàng hoặc ảnh cũ vị trí bàn làm việc thường cắm ổ này giúp em ạ.',
    },
  ],
  headphone: [
    {
      label: 'Hãng / model',
      text: 'Thương hiệu, model và màu sắc của tai nghe là gì ạ?',
    },
    {
      label: 'Đặc điểm riêng',
      text: 'Đệm tai có vết mòn đặc trưng hoặc dây cáp đi kèm đặc biệt nào không ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh hóa đơn mua hàng, hộp gốc, hoặc màn hình Bluetooth đã ghép nối trên thiết bị giúp em ạ.',
    },
  ],
  earphone: [
    {
      label: 'Hãng / màu hộp',
      text: 'Thương hiệu và màu sắc của hộp sạc tai nghe là gì ạ?',
    },
    {
      label: 'Đặc điểm riêng',
      text: 'Hộp sạc có ốp bảo vệ riêng hoặc vết xước đặc trưng nào không ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh hóa đơn mua hàng, hộp gốc, hoặc màn hình Bluetooth đã ghép nối trên thiết bị giúp em ạ.',
    },
  ],

  // --- PERSONAL BELONGINGS (tập trung vào vật bên trong và đặc điểm tùy chỉnh) ---
  wallets: [
    {
      label: 'Vật bên trong',
      text: 'Quý khách hãy nêu một món đồ cụ thể không phải tiền mặt nằm bên trong ví (ví dụ: thẻ tích điểm, ảnh, hoặc hóa đơn gấp) ạ.',
    },
    {
      label: 'Hãng / màu / chất liệu',
      text: 'Thương hiệu, màu sắc và chất liệu của ví là gì ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh hóa đơn/sao kê của một trong các thẻ bên trong, hoặc ảnh cũ đang cầm ví giúp em ạ.',
    },
  ],
  keys: [
    {
      label: 'Số lượng chìa',
      text: 'Chùm chìa khóa có chính xác bao nhiêu chiếc chìa ạ?',
    },
    {
      label: 'Móc / chìa đặc biệt',
      text: 'Quý khách hãy mô tả móc khóa, fob hoặc chiếc chìa có hình dạng/màu sắc đặc biệt trong chùm ạ.',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh chìa khóa dự phòng, ổ khóa tương ứng, hoặc ảnh cũ có móc khóa này giúp em ạ.',
    },
  ],
  suitcases: [
    {
      label: 'Vật bên trong',
      text: 'Quý khách hãy nêu một món đồ rất cụ thể được xếp trong ngăn hoặc túi kín của vali ạ.',
    },
    {
      label: 'Hãng / màu / thẻ',
      text: 'Thương hiệu, màu sắc và có thẻ hành lý hay ruy băng đặc biệt nào gắn kèm không ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh thẻ ký gửi hành lý, lịch trình chuyến đi, hoặc ảnh cũ đang đi cùng vali giúp em ạ.',
    },
  ],
  backpack: [
    {
      label: 'Vật trong ngăn',
      text: 'Quý khách hãy nêu một món đồ nằm trong một trong các ngăn nhỏ, kín của ba lô ạ.',
    },
    {
      label: 'Hãng / màu / đặc điểm',
      text: 'Thương hiệu, màu sắc và có huy hiệu, móc khóa hay vết bẩn đặc trưng nào bên ngoài không ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh hóa đơn mua hàng, lịch sử đặt hàng online, hoặc ảnh cũ đang đeo ba lô giúp em ạ.',
    },
  ],
  clothings: [
    {
      label: 'Nhãn (hãng / size)',
      text: 'Thương hiệu, size và màu sắc ghi trên nhãn bên trong là gì ạ?',
    },
    {
      label: 'Đặc điểm riêng',
      text: 'Món đồ có vết bẩn, vết rách, mất nút hoặc chỉnh sửa tùy chỉnh nào không ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh hóa đơn mua hàng hoặc ảnh cũ đang mặc đúng món đồ này giúp em ạ.',
    },
  ],
  jewelry: [
    {
      label: 'Đặc điểm riêng',
      text: 'Món trang sức có khắc chữ tùy chỉnh, mất viên đá hoặc loại khóa cài đặc biệt nào không ạ?',
    },
    {
      label: 'Chất liệu / hãng',
      text: 'Chất liệu chính xác (ví dụ: bạc 925, vàng 14k) nếu có dập, và thương hiệu là gì ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh giấy thẩm định, hóa đơn, hộp gốc, hoặc ảnh cũ rõ nét đang đeo món này giúp em ạ.',
    },
  ],

  // --- OTHERS (mặc định khi không khớp subcategory nào) ---
  others: [
    {
      label: 'Đặc điểm riêng',
      text: 'Đặc điểm vật lý nhận dạng riêng mà chỉ chủ sở hữu mới biết (ví dụ: số serial, dấu ẩn, hư hỏng cụ thể) của món đồ là gì ạ?',
    },
    {
      label: 'Hãng / model / màu',
      text: 'Thương hiệu, model và màu sắc của món đồ là gì ạ?',
    },
    {
      label: 'Bằng chứng',
      text: 'Quý khách vui lòng gửi ảnh hóa đơn mua hàng, bao bì gốc, hoặc ảnh cũ có món đồ giúp em ạ.',
    },
  ],
}

/** Subcategory used when a claim's code has no tailored question set. */
const FALLBACK_CODE = 'others'

/**
 * Build the "Yêu cầu xác minh" quick replies for a claim, picking the question
 * set that matches the claim's subcategory `code` (falling back to `others`).
 */
export function getVerificationQuickReplies(code?: string | null): QuickReply[] {
  const questions =
    code && code in HANDOVER_VERIFICATION_QUESTIONS
      ? HANDOVER_VERIFICATION_QUESTIONS[code]
      : HANDOVER_VERIFICATION_QUESTIONS[FALLBACK_CODE]
  return questions.map((q) => ({
    label: q.label,
    text: q.text,
    section: HANDOVER_VERIFICATION_SECTION,
  }))
}
