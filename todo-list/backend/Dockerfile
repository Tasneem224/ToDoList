# ---------- مرحلة البناء (Builder) ----------
    FROM node:18-slim AS builder

    WORKDIR /app
    
    # نسخ ملفات الـ dependencies وتثبيتها
    COPY package.json ./
    RUN npm install --production
    
    # نسخ كود التطبيق
    COPY app.js ./
    
    # ---------- مرحلة التشغيل (Final stage) ----------
    FROM node:18-slim
    
    # إعداد مجلد العمل
    WORKDIR /app
    
    # نسخ الملفات الجاهزة من مرحلة البناء
    COPY --from=builder /app /app
    
    # إعطاء صلاحية ملكية المجلد للمستخدم node الافتراضي
    RUN chown -R node:node /app
    
    # استخدام الـ user الافتراضي node (موجود بالفعل في الصورة الأساسية)
    USER node
    
    # إعداد المتغيرات البيئية
    ENV NODE_ENV=production
    ENV PORT=3000
    
    # فتح البورت
    EXPOSE 3000
    
    # أمر التشغيل
    CMD ["node", "app.js"]
    