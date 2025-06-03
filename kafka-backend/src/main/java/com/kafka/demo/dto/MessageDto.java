package com.kafka.demo.dto;

import java.time.LocalDateTime;

public class MessageDto {
    private String content;
    private String topic;
    private int partition;
    private long offset;
    private String consumerGroup;
    private LocalDateTime timestamp;

    public MessageDto() {
        this.timestamp = LocalDateTime.now();
    }

    public MessageDto(String content, String topic, int partition, long offset, String consumerGroup) {
        this.content = content;
        this.topic = topic;
        this.partition = partition;
        this.offset = offset;
        this.consumerGroup = consumerGroup;
        this.timestamp = LocalDateTime.now();
    }

    // Getters y Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public int getPartition() {
        return partition;
    }

    public void setPartition(int partition) {
        this.partition = partition;
    }

    public long getOffset() {
        return offset;
    }

    public void setOffset(long offset) {
        this.offset = offset;
    }

    public String getConsumerGroup() {
        return consumerGroup;
    }

    public void setConsumerGroup(String consumerGroup) {
        this.consumerGroup = consumerGroup;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "MessageDto{" +
                "content='" + content + '\'' +
                ", topic='" + topic + '\'' +
                ", partition=" + partition +
                ", offset=" + offset +
                ", consumerGroup='" + consumerGroup + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}